# Linear Regression

## $d$-Dimension Vector to $\mathbb{R}$

$m$: size of dataset 数据点个数

$d$: dimension/length of each feature vector (input) 输入的维度/长度

$y_i$: scaler or real-valued target/output 输出

Design a function $f_{\mathbf{W}, b}(\mathbf{x})$ i.e.

$$
f_{\mathbf{w}, b}(\mathbf{x})=\mathbf{w}^{\top}\mathbf{x}+b
$$

- weight: $\mathbf{w}\in \mathbb{R}^d$
- bias/offset: $b\in \mathbb{R}$

written in vector form:

$$
f_{\mathbf{w}, b}=\begin{bmatrix}
b\\
\mathbf{w}
\end{bmatrix}^{\top}\begin{bmatrix}
1\\
\mathbf{x}
\end{bmatrix}
$$

let $\overline {\mathbf{x}} = \begin{bmatrix}1\\\mathbf{x}\end{bmatrix}, \overline {\mathbf{w}} = \begin{bmatrix}b\\\mathbf{w}\end{bmatrix}$, then we have $f_{\mathbf{w}, b}(\mathbf{x})={\overline{\mathbf{w}}}^{\top}\overline{\mathbf{x}}=\overline{\mathbf{x}}^{\top}\overline{\mathbf{w}}$

### Objective (loss) Function 
let $\mathrm{X}=[\overline{\mathbf{x}}^{\top}_1, \overline{\mathbf{x}}^{\top}_2, \dots, \overline{\mathbf{x}}^{\top}_m]^{\top} \in \mathbb{R}^{m\times (d+1)}$ and $\mathbf{y}=[y_1, y_2, \dots, y_m]^{\top}\in \mathbb{R}^m$ , then loss function is 

$$
\begin{aligned}
\mathrm{Loss}(\mathbf{w}, b)
&= \frac{1}{m}\sum_{i=1}^m (f_{\mathbf{w}, b}(\mathbf{x}_i)-y_i)^2 \\
&= \frac{1}{m}\sum_{i=1}^m ({\overline{\mathbf{w}}}^{\top}\overline{\mathbf{x}}_i-y_i)^2 \\
&= \frac{1}{m}(\mathrm{X}\overline{\mathbf{w}}-\mathbf{y})^{\top}(\mathrm{X}\overline{\mathbf{w}}-\mathbf{y})
\end{aligned}
$$

then let $J(\overline{\mathbf{w}})=(\mathrm{X}\overline{\mathbf{w}}-\mathbf{y})^{\top}(\mathrm{X}\overline{\mathbf{w}}-\mathbf{y})=2\overline{\mathbf{w}}^{\top}\mathrm{X}^{\top}\mathrm{X}\overline{\mathbf{w}}-2\overline{\mathbf{w}}^{\top}\mathrm{X}^{\top}\mathbf{y}+\mathbf{y}^{\top}\mathbf{y}$.
the derivative is $\frac{\mathrm{d}J}{\mathrm{d}\overline{\mathbf{w}}}=2\overline{\mathbf{w}}^{\top}\mathrm{X}^{\top}\mathrm{X}-2\mathbf{y}^{\top}\mathrm{X}$ . Then we have $\color{red}{\overline{\mathbf{w}}^*}=(\mathrm{X}^{\top}\mathrm{X})^{-1}\mathrm{X}^{\top}\mathbf{y}$

### MLE
let the likelihood function be

$$
L(\overline{\mathbf{w}}, \sigma^2 | \{y_i, \mathbf{x}_i\})=\frac{1}{\sqrt{2\pi \sigma^2}}\prod_{i=1}^m \exp\left(-\frac{(y_i - \overline{\mathbf{w}}^\top \mathbf{x}_i)^2}{2\sigma^2}\right)
$$

MLE of distribution of error: $e_i\sim \mathcal{N}(0, \hat{\sigma}^2)$

## $d$-Dimensional Vector to $h$-Dimensional Vector

$h$: dimension/length of output vector

$\mathbf{y}$: output $\in \mathbb{R}^h$

Then $\mathrm{W}\in \mathbb{R}^{h\times d}, \mathbf{b}\in \mathbb{R}^d, \overline{\mathrm{W}}=\begin{bmatrix}\mathbf{b}^{\top}\\\mathrm{W}\end{bmatrix}\in \mathbb{R}^{(d+1)\times h}$ 

then $f_{\mathrm{W}, \mathbf{d}}(\mathbf{x})=\mathrm{W}^\top\mathbf{x}+\mathbf{b}$

then we have

$$
\begin{aligned}
\hat{\mathrm{w}}&=(\overline{\mathbf{X}}^\top\overline{\mathbf{X}})^{-1}\overline{\mathbf{X}}^\top\mathbf{y}\\
\hat{\sigma}^2&=\frac{1}{m}\sum_{i=1}^m \left(y_i-\begin{bmatrix}1&\mathbf{x}_i^\top\end{bmatrix}\hat{\mathrm{w}}\right)^2=\frac{1}{m}(\overline{\mathrm{X}}\hat{\mathbf{w}}-\mathbf{y})^\top(\overline{\mathrm{X}}\hat{\mathbf{w}}-\mathbf{y})
\end{aligned}
$$

### Objective (Loss) Function

let $\overline{\mathrm{Y}}=[\mathbf{y}_1^\top, \mathbf{y}_2^\top, \dots, \mathbf{y}_m^\top]^\top \in \mathbb{R}^{m\times h}$ and $\mathrm{X}$ is the same as the previous definition.

then

$$
\mathrm{Loss}(\overline{\mathrm{W}})=\sum_{k=1}^h \left(\mathrm{X}\overline{\mathrm{W}}^{(k)}-\mathrm{Y}^{(k)}\right)^\top\left(\mathrm{X}\overline{\mathrm{W}}^{(k)}-\mathrm{Y}^{(k)}\right)
$$

Then the least squares solution is $\overline{\mathrm{W}}^*=\arg\min_{\mathrm{W},\mathbf{b}} \mathrm{Loss}\left(\overline{\mathrm{W}}\right)=\color{red}{\left(\mathrm{X}^\top\mathrm{X}\right)^{-1}\mathrm{X}^\top\mathrm{Y}}$

we need to guarantee that $\mathrm{X}$ is full rank to make $(\mathrm{X}^\top\mathrm{X})^{-1}$ exist. 

## For Binary Classification

let $\mathrm{sign}(x)=\begin{cases}1 & \text{if } x>0 \\ 0 &\text{if }x=0 \\ -1 &\text{otherwise}\end{cases}$

we just need to modify the output with 

$$
g_{\mathbf{w}, b}(\mathbf{x})=\mathrm{sign}(f_{\mathbf{w},b}(\mathbf{x}))=\mathrm{sign}\left(\overline{\mathbf{x}}^\top\mathbf{w}\right)
$$

PS: output $=0$ declares error.

## For Multi-class Classification

Apply **one-hot encoding** . Assume that there are $h$ labels, then for one output $\mathbf{y}\in\mathbb{R}^h$, which is $t$-th label, then we have $\forall i\in \mathbb{Z}\cap [1, h]\backslash\{x\}, y_i=0, y_t=1$ . 用人话来说就是在正确的标签上面打一个 $1$, 其余位置为 $0$. 

Then the output label can be 

$$
\mathrm{output}=\arg\max_{k\in \{1, 2, ... h\}} \left\{\overline{\mathbf{x}}^\top \overline{\mathrm{W}}^{(k)}\right\}
$$

选取值最大的一个

## Polynomial Regression

Treat different polynomial items of one input as items of different dimensions of input.

Assume that we have an $p$-ordered input, then $d'=\binom{d+p}{p}$. And the input can be like this:

$$
\mathbf{p}=\begin{bmatrix}1&x_1&x_2&\dots&x_1x_2&\dots&x_1x_2x_3&\dots&\prod_{i=1}^p x_i&\dots\end{bmatrix}^\top \in \mathbb{R}^{\binom{d+p}{p}}
$$

Then for 1-d output, weight vector is $\mathbf{w}\in\mathbb{R}^{\binom{d+p}{p}}$ 
For multi-dimensional output, weight matrix is $\mathrm{W}\in \mathbb{R}^{\binom{d+p}{p}\times h}$

and

$$
\begin{aligned}
y=\mathbf{p}^\top \mathbf{w} \\
\mathbf{y}=\mathbf{p}^\top \mathrm{W}
\end{aligned}
$$

Then we have $\mathrm{P}=\begin{bmatrix}\mathbf{p}_1^\top&\mathbf{p}_2^\top&\dots&\mathbf{p}_n^\top\end{bmatrix}^\top\in \mathbb{R}^{m\times \binom{d+p}{p}}$



Similarly, we have 

$$
\begin{aligned}
\mathbf{w}^*&=\mathrm{P}^\top\left(\mathrm{P}\mathrm{P}^\top\right)^{-1}\mathbf{y} \\
\mathrm{W}^*&=\mathrm{P}^\top\left(\mathrm{P}\mathrm{P}^\top\right)^{-1}\mathrm{Y}
\end{aligned}
$$

## Ridge Regresion

Assume that when the data have many variables/attributes and the dimension ($d$) is large, and few samples ($m$) is small. Then $\mathrm{X}\in \mathbb{R}^{m\times (d+1)}$ which is hard to be full rank, then $\mathrm{X}^\top\mathrm{X}$ may not exist.

Then modify the loss function with a positive constant $\lambda$ : 

$$
\begin{aligned}
J(\overline{\mathbf{w}})&=\sum_{i=1}^m \left(\overline{\mathbf{x}}^\top_i\overline{\mathbf{w}}-y_i\right)^2+\lambda\sum_{i=1}^{d+1}\overline{w}_i^2 \\
&=(\mathrm{X}\overline{\mathbf{w}}-\mathbf{y})^\top(\mathrm{X}\overline{\mathbf{w}}-\mathbf{y})+\lambda\overline{\mathbf{w}}^\top\overline{\mathbf{w}}
\end{aligned}
$$

Then we get 

$$
\color{red}{
\overline{\mathbf{w}}^*=\left(\mathrm{X}^\top\mathrm{X}+\lambda \mathrm{I}_{d+1}\right)^{-1}\mathrm{X}^\top\mathbf{y}}
$$

This form is called **Primal Form**. 

where $\mathrm{X}^\top\mathrm{X}+\lambda \mathrm{I}_{d+1}$ is always invertible. This can be proved by applying theorems mentioned in *Mathematical Tools* .

Since $\mathrm{X}^\top\mathrm{X}+\lambda \mathrm{I}_{d+1}\in \mathbb{R}^{(d+1)\times (d+1)}$ can be large and computation of its inverse is costly, we need **Dual Form**, which is :


$$
\color{red}{
\overline{\mathbf{w}}^*=\mathrm{X}^\top\left(\mathrm{X}\mathrm{X}^\top+\lambda \mathrm{I}_m\right)^{-1}\mathbf{y}}
$$

Which is equivalent to **Primal Form**. It can be obtained from **Primal Form** applying *Woodbury Formula*.

PS: polynomial ridge regression is which just replace $\mathrm{X}$ by $\mathrm{P}$ .

## Logistic Regression

Give an input vector $\mathbf{x}\in \mathbb{R}^{d}$ . The parameters of logistic regression are $\vec{\theta}\in \mathbb{R}^d, \theta_0\in \mathbb{R}$ . let $g$ be the sigmoid function.

$$
\mathrm{Pr}\left(y=1|\mathbf{x},\vec{\theta},\theta_0\right)=g\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)=\frac{1}{1 + \exp\left(-\left<\vec\theta,\mathbf{x}\right>-\theta_0\right)}
$$

More generally, we have 

$$
\mathrm{Pr}\left(y=y_0|\mathbf{x}=\mathbf{x}_0,\vec\theta,\theta_0\right)=g\left(y_0\left(\left<\vec\theta,\mathbf{x}_0\right>+\theta_0\right)\right)
$$

where $y_0\in\{-1, 1\}$

### Why?
**logs-odd** should be linear function:

$$
\log\frac{\mathrm{Pr}\left(y=1|\mathbf{x},\vec\theta,\theta_0\right)}{\mathrm{Pr}\left(y=-1|\mathbf{x},\vec\theta,\theta_0\right)}=\left<\vec\theta,\mathbf{x}\right>+\theta_0
$$

Decision boundary:
where $\left<\vec\theta,\mathbf{x}\right>+\theta_0=0$

### MLE

Likelihood function of $(\mathrm{x_0},y_0)$ of given $(\vec\theta, \theta_0)$: 

$$
L\left(\vec\theta, \theta_0|\mathrm{x_0},y_0\right)=\mathrm{Pr}\left(y=y_0|\mathbf{x}=\mathbf{x}_0,\vec\theta,\theta_0\right)
$$

For likelihood function data set $\mathcal{D}=\{(\mathrm{x}_i, y_i)_i\}$

$$
L\left(\vec\theta, \theta_0|\mathcal{D}\right)=\prod_{i=1}^m \mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right)
$$

we need to maximum the value of $L(\vec\theta, \theta_0|\mathcal{D})$ .

$$
\begin{aligned}
\arg\max_{\vec\theta, \theta_0}\left\{L(\vec\theta, \theta_0|\mathcal{D})\right\}
&=\arg\max_{\vec\theta, \theta_0}
    \sum_{i=1}^m 
        \log \mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right) \\
&=\arg\min_{\vec\theta, \theta_0}
    \sum_{i=1}^m 
        \log \mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right) \\
&=\arg\min_{\vec\theta, \theta_0}
    \sum_{i=1}^m 
        \log \left[1+\exp\left(-y_i\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)\right)\right]
\end{aligned}
$$

Denote that 

$$
l\left(\vec\theta, \theta_0|\mathcal{D}\right)=\sum_{i=1}^m \log \left[1+\exp\left(-y_i\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)\right)\right]
$$

### Applying Stochastic Gradient Descent

$$
\begin{aligned}
\frac{\mathrm{d}}{\mathrm{d}\theta_0}\left(\log \left[1+\exp\left(-y_i\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)\right)\right]\right)
&= -y_i\frac
    {\exp\left(-y_i\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)\right)}
    {1+\exp\left(-y_i\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)\right)} \\
&= \color{red}{-y_i\left[1-\mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right)\right]}\\
\frac{\mathrm{d}}{\mathrm{d}\vec\theta}\left(\log \left[1+\exp\left(-y_i\left(\left<\vec\theta,\mathbf{x}\right>+\theta_0\right)\right)\right]\right)
&=
\color{red}{-y_i\mathbf{x}_i\left[1-\mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right)\right]}\\
\end{aligned}
$$

Then 

$$
\begin{aligned}
\frac{\mathrm{d}l\left(\vec\theta, \theta_0|\mathcal{D}\right)}{\mathrm{d}\theta_0}
&= \sum_{i=1}^n 
    -y_i\left[1-\mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right)\right] \\
\frac{\mathrm{d}l\left(\vec\theta, \theta_0|\mathcal{D}\right)}{\mathrm{d}\vec\theta}
&= \sum_{i=1}^n
    -y_i\mathbf{x}_i\left[1-\mathrm{Pr}\left(y=y_i|\mathbf{x}=\mathbf{x}_i,\vec\theta,\theta_0\right)\right]
\end{aligned}
$$

SGD leads to **no** significant change on average when the gradient of the full objective equals zero.

### Regularization in Logistic Regression 正则化

likelihood function is strictly increasing as function of $y_i\left(\left<\vec\theta, \mathbf{x}\right>+\theta_0\right)$ . Then we can infinitely scale the parameters to obtains the higher likelihood. This can make the model emphasis too much on the partial features and noise, which leads to overfitting. 参数无限制增大会导致模型过度关注噪声和局部特征，导致过拟合。

e.g. $l_2$-norm :

$$
\arg\min_{\vec\theta, \theta_0}\left\{ \frac{\lambda}{2}\left\Vert\vec\theta\right\Vert^2 + l(\vec\theta, \theta_0|\mathcal{D}) \right\}
$$

### Multi-Class Logistic Regression

If we have $h\ge 2$ classes, replace $\mathrm{Pr}(y=1|\mathbf{x},\vec\theta,\theta_0)$ by **soft-max** function:

$$
\mathrm{Pr}(y=c|\mathbf{x},\vec\theta, \theta_0)=\frac
	{\exp\left(\left<\vec\theta_c, \mathbf{x}\right>+\theta_{0,c}\right)}
	{\sum_{i=1}^h {\exp\left(\left<\vec\theta_i, \mathbf{x}\right>+\theta_{0,i}\right)}}
$$