# 前言
本文参考了 [XHCI on OS Dev](https://wiki.osdev.org/XHCI) 以及 《USB: The Universal Series Bus》。代码存储于 ``github.com/juruohejiarui/VCPP-2.git`` 中的 ``VOS/kernel/hardware/USB`` .

需要先简单了解 PCIe 的数据结构和枚举、检测 UEFI 提供的 PCIe 信息的方法。

# 数据结构和注释
## PCIe
从 UEFI 提供的 ``MCFG`` 表中，可以读出一个 PCIe 数据表头的结构，我们称之为 ``PCIeConfig``，对于 XHCI 设备，其结构一般如下：

| Offset | Size(Byte) | Name | Description |
| :----: | :--------: | :--------: | :-------: |
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
| 0x3d		| $1$ | Interrupt PIN				| 用于指定该设备使用哪个中断引脚，$\texttt{0x0}\rightarrow \text{does not use},\texttt{0x1}\rightarrow \texttt{INTA}, \texttt{0x2}\rightarrow \texttt{INTB}, \texttt{0x3}\rightarrow \texttt{INTC}, \texttt{0x4}\rightarrow \texttt{INTD}$
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
可以翻译为使能寄存器组，这些寄存器均为只读(RO)寄存器。其基地址可以使用 ``PCIeConfig`` 的 $\text{bar0}, \text{bar1}$ 组合获取，计算方式如下：

```c
// 将两个地址的值拼接起来，然后对 4K 下取整对齐
addr=(bar0 | (bar1 << 32)) & (~((1 << 12) - 1))
```

这个 ``addr`` 可以记录为 $\text{BaseAddr}$ ，稍后依然会用到。接下来直接列出这些寄存器的信息：

| Offset | Size(Byte) | Name | Description |
| :----: | :--------: | :--------: | :-------: |
| 0x0	| 1	| CapLen	| 使能寄存器组的大小 |
| 0x1	| 1	| RSVD		| 保留	|
| 0x2	| 2	| hciVersion	| 接口的版本数字，不需要关注 |
| 0x4	| 4 | hcsParams1		| 结构化的参数组 #1 |
| 0x8	| 4 | hcsParams2		| 结构化的参数组 #2 |
| 0xc	| 4 | hcsParams3		| 结构化的参数组 #3	|
| 0x10	| 4	| hccParams1		| 使能参数组 #1 |
| 0x14	| 4 | dbOff		| Doorbell 寄存器组的偏移（相对于 $\text{BaseAddr}$）|
| 0x18	| 4	| rtsOff	| 运行时寄存器空间的偏移，相对于 （相对于 $\text{BaseAddr}$）|
| 0x1c	| 4 | hccParams2		| 使能参数组 #2 |

上面的表中提到了五个参数组，实际上就是将一些值比较小的信息拼接起来，节省空间，接下来给出每个参数组的具体内容。

#### hcsParams 1, 结构化的参数组 #1

| Bit | Name | Description |
| :----: | :--------: | :--------: |
| 0:7	| MaxSlots	| 最大插槽的编号 |
| 8:18	| MaxIntrs	| 最大的中断编号 |
| 19:23 | Reserved	| 保留 |
| 24:31 | MaxPorts	| 最大端口的编号 |

#### hcsParams 2, 结构化的参数组 #2

| Bit | Name | Description |
| :----: | :--------: | :--------: |
| 0:3	| Isochronous Scheduling Threshold (IST)	| 告诉软件它可以在多远的帧中修改 TRH（传输请求块）并且仍能正确执行 |
| 4:7	| Event Ring Segment Table Max (ERST Max)	| Event Ring Segment Table Base Size registers (稍后会有解释) 可以支持的最大值 |
| 8:20	| Reserved	| 保留
| 21:25	| Max Scractchpad Buffer(High 5 bits)  		| 
| 26	| Scratchpad Restore(SPR)	| 表示是否支持暂存器保存/恢复缓冲区 |
| 27:31	| Max Scractchpad Buffer(Low 5 bits)		|

将 Max Scractchpad Buffer 拼接起来可以得到软件需要申请的用于暂存器缓冲区的内容大小，如果该值为 $0$ ，那么就不需要申请内容，更多要求则和接下来提到的pageSize的值有关，但是在本人的机子上，这个值都是 $0$。