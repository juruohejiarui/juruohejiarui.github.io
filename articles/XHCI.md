# 前言
本文参考了 [XHCI on OS Dev](https://wiki.osdev.org/XHCI) 以及 《USB: The Universal Series Bus》。代码存储于 ``github.com/juruohejiarui/VCPP-2.git`` 中的 ``VOS/kernel/hardware/USB`` .

需要先简单了解 PCIe 的数据结构和枚举、检测 UEFI 提供的 PCIe 信息的方法。

# 数据结构和注释
## PCIe
从 UEFI 提供的 ``MCFG`` 表中，可以读出一个 PCIe 数据表的结构，我们称之为 ``PCIeConfig``，对于 XHCI 设备，其结构一般如下：

| Offset | Size(Byte) | Name | Description |
| :----: | :--------: | :--------: | :-------: |
| 0x0       | 2 | Vendor ID | 制造商 ID |
| 0x2       | 2 | Device ID | 制造商申请的设备特定的 ID |
| 0x4       | 2 | Command 	| 用于操作该PCIe设备的寄存器 |
| 0x6		| 2 | Status	| 该设备的状态 |
| 0x8		| 1 | Revision ID	| 我也不懂，应该不太重要，可以忽略 |
| 0x9		| 1 | Prog IF 	| Program Interface Byte, 只读，用于寄存器级别下指定该设备的类别 |
| 0xa		| 1 | Subclass 	| 子类 ID	|
| 0xb		| 1 | Class Id	| 类 ID		|
| 0xc		| 1	| Cache Line Size 	| 

$\text{Class Id, subClass, Prog IF}$ 三者共同确认一个设备的类别，网上有对照表，这里就不粘出来了。对于 XHCI 设备，$\text{Class Id}=\texttt{0xC}, \text{Subclass}=\texttt{0x3}, \text{Prog IF}=\texttt{0x30}$