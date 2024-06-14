# 前言
本文参考了 [XHCI on OS Dev](https://wiki.osdev.org/XHCI) 以及 《USB: The Universal Series Bus》。代码存储于 ``github.com/juruohejiarui/VCPP-2.git`` 中的 ``VOS/kernel/hardware/USB`` .

需要先简单了解 PCIe 的数据结构和枚举、检测 UEFI 提供的 PCIe 信息的方法。

# 数据结构和注释

XHCI 控制器有大量的寄存器组和描述，需要一定的耐心。但是我们不需要全部了解，只需要知道一些基本的，可以用于设备枚举，检测和通信的寄存器就可以了。但是为了查阅方便，这里我还是几乎完全摘抄了《USB: The Universal Series Bus》对于每一个描述符的解释。当我们需要某些功能的时候再回来查阅表格即可。如果学习过程中发现一些不懂得名词，可以先把它记下来，之后遇到了定义或解释的时候再返回来看，如果之后都没有出现，那么就可以认为它并不重要。

## PCIe
从 UEFI 提供的 ``MCFG`` 表中，可以读出一个 PCIe 数据表头的结构，我们称之为 ``PCIeConfig``，对于 XHCI 设备，其结构一般如下：

| Offset | Size(Byte) | Name | Description |
| :----: | :--------: | :--------: | :------- |
| 0x0       | $2$ | Vendor ID | 制造商 ID |
| 0x2       | $2$ | Device ID | 制造商申请的设备特定的 ID |
| 0x4       | $2$ | Command 	| 用于操作该PCIe设备的寄存器 |
| 0x6		| $2$ | Status		| 该设备的状态 |
| 0x8		| $1$ | Revision ID	| 我也不懂，应该不太重要，可以忽略 |
| 0x9		| $1$ | Prog IF 	| Program Interface Byte, 只读，用于寄存器级别下指定该设备的类别 |
| 0xa		| $1$ | Subclass 	| 子类 ID	|
| 0xb		| $1$ | Class Id	| 类 ID		|
| 0xc		| $1$ | Cache Line Size 	| 我也不懂，应该不太重要，可以忽略 |
| 0xd		| $1$ | Latency Timer		| 用于PCI，PCIe不支持，固定为 $0$ |
| 0xe		| $1$ | Header Type			| 指示该表头剩余内容的结构 |
| 0xf		| $1$ | BIST				| Built-in self test, 设备的内建自检状态和控制寄存器 |
| 0x10		| $4$ | Bar0				| Base Address 0 |
| 0x14		| $4$ | Bar1				| Base Address $1$ |
| 0x18		| $4$ | Bar2				| Base Address $2$ |
| 0x1c		| $4$ | Bar3				| Base Address 3 |
| 0x20		| $4$ | Bar4				| Base Address $4$ |
| 0x24		| $4$ | Bar5				| Base Address 5 |
| 0x28 		| $4$ | Cardbus CIS Pointer 	| 指向 Cardbus 结构的指针，该值被 PCI 和 Cardbus 共享（机翻） |
| 0x2c		| $2$ | Subsystem Vendor ID		| 子系统的Vendor ID, 不重要 |
| 0x2e		| $2$ | subsystem ID			| 子系统ID，不重要 |
| 0x30		| $4$ | Expansion ROM base address	| 不懂，应该不太重要 |
| 0x34		| $1$ | Capabilities Pointer		| 使能寄存器的偏移量 |
| 0x35		| $7$ | Reserved					| 保留位置，不能读写 |
| 0x3c		| $1$ | Interrupt Line				| 用于指定该设备连接到 PIC (不是I/O APIC) 的 (IRQ0,IRQ1...IRQ15) 哪个（些）引脚, $\texttt{0xff}$ 则表示无连接 |
| 0x3d		| $1$ | Interrupt PIN				| 用于指定该设备使用哪个中断引脚，$\texttt{0x0}\rightarrow \text{does not use},\texttt{0x1}\rightarrow \texttt{INTA}, \texttt{0x2}\rightarrow \texttt{INTB}$, $\texttt{0x3}\rightarrow \texttt{INTC}$, $\texttt{0x4}\rightarrow \texttt{INTD}$
| 0x3e		| $1$ | Min Grant					| 用于 PCI ，PCIe 下不可用，固定为 $0$ |
| 0x3f		| $1$ | Max Latency					| 用于 PCI ，PCIe 下不可用，固定为 $0$ |


$\text{Class Id, subClass, Prog IF}$ 三者共同确认一个设备的类别，网上有对照表，这里就不粘出来了。对于 XHCI 设备，$\text{Class Id}=\texttt{0xC}, \text{Subclass}=\texttt{0x3}, \text{Prog IF}=\texttt{0x30}$

### Header Type 结构

| Bit 7 | Bit 0 : 6 |
| :---: | :-------: |
| 该设备是(1)/否(0)为多功能(multi-function)设备 | 表头剩余结构的类型 |

对于 Bit $0:6$ ，只有 $\texttt{0x0},\texttt{0x1},\texttt{0x2}$ 三种取值，分别表示该 PCIe 设备是一个 General Device, PCI-to-PCI bridge, PCI-to-Cardbus bridge ，对于 XHCI 设备，其 $\text{Header Type}$ 值一定为 $\texttt{0x0}$ 或 $\texttt{0x80}$ 。而上述展示的PCIe表结构就是 Bit $0:6=\texttt{0x0}$ 时的结构，对于其他情况，可以参考 [PCI on OS Dev](https://wiki.osdev.org/PCI) 。

## XHCI

### Capability Registers
可以翻译为使能寄存器组，这些寄存器均为只读(RO)寄存器。存储了大量的控制器支持信息。其基地址可以使用 ``PCIeConfig`` 的 $\text{bar0}, \text{bar1}$ 组合获取，计算方式如下：

```c
// 将两个地址的值拼接起来，然后对 4K 下取整对齐
addr=(bar0 | (bar1 << 32)) & (~((1 << 12) - 1))
```

这个 ``addr`` 可以记录为 $\text{baseAddr}$ ，稍后依然会用到。接下来直接列出这些寄存器的信息：

| Offset | Size(Byte) | Name | Description |
| :----: | :--------: | :--------: | :------- |
| 0x0	| 1	| CapLen	| 使能寄存器组的大小 |
| 0x1	| 1	| RSVD		| 保留	|
| 0x2	| 2	| hciVersion	| 接口的版本数字，不需要关注 |
| 0x4	| 4 | hcsParams1		| 结构化的参数组 #1 |
| 0x8	| 4 | hcsParams2		| 结构化的参数组 #2 |
| 0xc	| 4 | hcsParams3		| 结构化的参数组 #3	|
| 0x10	| 4	| hccParams1		| 使能参数组 #1 |
| 0x14	| 4 | dbOff		| Doorbell 寄存器组的偏移，对 $4$ 对齐（相对于 $\text{baseAddr}$）|
| 0x18	| 4	| rtsOff	| 运行时寄存器空间的偏移，对 $64$ 对齐，相对于 （相对于 $\text{baseAddr}$）|
| 0x1c	| 4 | hccParams2		| 使能参数组 #2 |

上面的表中提到了五个参数组，实际上就是将一些值比较小的信息拼接起来，节省空间，接下来给出每个参数组的具体内容。

#### hcsParams 1, 结构化的参数组 #1

| Bit | Name | Description |
| :----: | :--------: | :-------- |
| 0:7	| MaxSlots	| 最大插槽的编号 |
| 8:18	| MaxIntrs	| 最大的中断编号 |
| 19:23 | Reserved	| 保留 |
| 24:31 | MaxPorts	| 最大端口的编号 |

这三个最大值可以用于枚举端口和中断，但注意，可用的端口和选择使用的中断可能并不连续。

#### hcsParams 2, 结构化的参数组 #2

| Bit | Name | Description |
| :----: | :--------: | :-------- |
| 0:3	| Isochronous Scheduling Threshold (IST)	| 告诉软件它可以在多远的帧中修改 TRB（传输请求块）并且仍能正确执行 |
| 4:7	| Event Ring Segment Table Max (ERST Max)	| Event Ring Segment Table Base Size registers (稍后会有解释) 可以支持的最大值 |
| 8:20	| Reserved	| 保留
| 21:25	| Max Scractchpad Buffer(High 5 bits)  		| 
| 26	| Scratchpad Restore(SPR)	| 表示是否支持暂存器保存/恢复缓冲区 |
| 27:31	| Max Scractchpad Buffer(Low 5 bits)		|

将 Max Scractchpad Buffer 拼接起来可以得到软件需要申请的用于暂存器缓冲区的内容大小，如果该值为 $0$ ，那么就不需要申请内容，更多要求则和接下来提到的pageSize的值有关，但是在本人的机子上，这个值都是 $0$。

#### hcsParams 3, 结构化的参数组 #3

| Bit | Name | Description |
| :----: | :--------: | :-------- |
| 0:7	| U1 Device Exit Latency | 电源状态从 U1 到 U0 所需要的微秒数 ($10^{-6}s=1\mu s$) | 
| 8:15 	| Reserved	| 保留 |
| 16:31	| U2 Device Exit Latency | 电源状态从 U1 到 U0 所需要的微秒数 |

#### hccParams 1, 使能参数组 #1

| Bit | Name | Description |
| :----: | :--------: | :-------- |
| 0		| 64-bit Addressing Capability(AC64)	| 该XHCI控制器是(1)否(0)可以使用64-bit地址，如果不能，那么接下来使用的所有地址，都会忽略高32位。|
| 1		| BW Negotiation Capability(BNC)		| 用于指示该控制器是(1)否(0)实现了 Bandwidth Negotiation |
| 2		| Context Size(CSZ)	| 指示上下文的大小 1: 64-byte; 0: 32-byte 。该位对 Stream Contexts 不生效。|
| 3		| Port Power Control(PPC)	| 1: 所有的端口永远处于通电状态；0: 每个端口可以自行控制供电状态 |
| 4		| Port Indicators(PIND)		| 用于指示端口指示灯的控制。0: 控制不可用; 1: 参照端口寄存器的 Bit 14:15 来获取更多信息 |
| 5		| Light HC Reset Capability(LHRC)	| 指示操作寄存器组中的 $\text{usbCmd}$ 寄存器的 Light Host Controller 功能是(1)否(0)可用 |
| 6		| Latency Tolerance Messaging Capability(LTC)	| 表示该控制器是(1)否(0)支持传递延迟容忍消息(Latency Tolerance Messageing, LTM) |
| 7		| No Secondary SID Support(NSS)	| **是(0)否(1)** 支持 Secondary Stream IDs.
| 8		| Parse All Event Data(PAE)		| 1: 当转移到下一个传输描述符的时候，所有的 TRB 都会被解析；0: 不会。检测到一个 Short Packet 的时候会使用这个位 |
| 9		| Stopped - Short Packet Capability(SPC)		| 该控制器是(1)否(0)可以发出短数据包停止代码(Stopped-Short Packet Completion code) |
| 10	| Stopped EDTLA Capability(SEC)					| 该控制器是(1)否(0)在 Stream Context 中实现了 Stopped EDTLA 区域，对于较新的硬件，这一位都是 $1$。 |
| 11	| Continuous Frame ID Capability(CFC)			| 该控制器是(1)否(0)能够匹配连续 ISO 传输描述符的 ID。|
| 12:15	| Maximum Primary Stream Array Size(MaxPSASize)	| 允许的最大 Stream Array 大小 |
| 16:31	| XHCI Extended Capabilities Pointer(xECP)		| 0: 该控制器不存在拓展使能描述; $>0$: 拓展使能描述的偏移（相对于 $\text{baseAddr}$ ）|

实际上的 Stream Array 最大大小需要使用如下方式计算 : 

$$
\text{maxSize}=2^{\text{MaxPSASize}+1}
$$

对于拓展时能描述的偏移实际上是：

$$
\text{offset of extended Capabilites}=\text{baseAddr} + 4\times \text{xECP}
$$

#### hccParams 2, 使能参数组 #2

| Bit | Name | Description |
| :----: | :--------: | :-------- |
| 0		| U3 Entry Capability	| 根(root hub)是否支持暂停完成通知(Suspend Completion notification) |
| 1		| ConfigEP Command Max Exit Latency too Large(CMC) | 是(1)否(0)可以生成最大退出潜伏期过长的兼容错误(Exit Latency too Large compatibility error)，该位被操作寄存器的 $\text{usbCmd}$ 的 CME 位使用。|
| 2		| Force Save Context Capability(FSC)	| Save State命令是(1)否(0)应当将所有的cached Slot, End Point, Stream和其他上下文存储到内存中 |
| 3		| Compliance Transition Capability(CTC)	| 该控制器是(1)否(0) 支持 Compliance Transition Enabled 位 	|
| 4		| Large ESIT Payload Capability(LEC)	| 是(1)否(0)支持大于 $48\texttt{Kb}$ 的 ESIT Payloads |
| 5		| Configuration Information Capability 	| 是(1)否(0)支持 输入控制上下文块(Input Control Context block) 中的 Configuration Value, Interface Number 和 Alternate settings 域的拓展配置信息 |

### Extended Capabilites List
除了上面的 Capability Registers，XHCI 还提供了链表结构的拓展使能列表，和 PCIe 非常类似。每个拓展描述符都长下面这样：

| Bit | Name | Description |
| :----: | :--------: | :-------- |
| 0:7	| ID	| RO, 该拓展描述符的 ID |
| 8:15	| Next	| RO, 下一个拓展描述符相对于当前描述符的偏移，计算方式如下：$\text{next offset}=\text{current offset} + 4\times \text{Next}$ |
| n		| Varies	| 每个 $\text{ID}$ 特定的内容 |

下面给出一些常用的 $\text{ID}$ 对照表：
