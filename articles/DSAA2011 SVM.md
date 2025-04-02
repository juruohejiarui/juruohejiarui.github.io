# Support Vector Machine (SVM) 支持向量机

## Preparation

Given a set of data $\mathcal{D}=\{(\mathbf{x}_i,y_i)\in \mathbb{R}^d\times \{-1,1\}:i=1,2,...n\}$

For any $\mathbf{x},y$ , correct classification by classifier $f_{\vec\theta}(\mathbf{x})=\mathrm{sign}\left({\vec\theta}^\top\mathbf{x}\right)$ means that :

$$
\begin{cases}
{\vec\theta}^\top\mathbf{x}>0,y=+1 \\
{\vec\theta}^\top\mathbf{x}<0,y=-1 \\
\end{cases}
\Leftrightarrow y=\mathrm{sign}\left({\vec\theta}^\top\mathbf{x}\right)
\Leftrightarrow y{\vec\theta}^\top\mathbf{x}>0
$$

### Definitions: 

**Margin of Classifier**: The margin of classifier $f_{\vec\theta}$ on sample $(\mathbf{x},y)$ is $y{\vec\theta}\mathbf{x}$ or $y\left<{\vec\theta}, \mathbf{x}\right>$

- **Positive Margin**: $(\mathbf{x},y)$ is correctly classified by $\vec{\theta}$ . 
- **Negative Margin**: $(\mathbf{x},y)$ is not correctly classified by $\vec{\theta}$
- **Bigger Margin**: $(\mathbf{x},y)$ is more correctly clasified by $\vec{\theta}$

**Linearly separable**: The dataset $\mathcal{D}=\{(\mathbf{x}_i,y_i)\in \mathbb{R}^d\times \{-1,1\}:i=1,2,...n\}$ is linearly separable if there exists some $\vec{\theta}$ such that 

$$
y_i=\mathrm{sign}\left({\vec{\theta}}^\top \mathbf{x}\right)\text{ or }y_i{\vec{\theta}}^\top\mathbf{x}_i>0~\forall i=1,2,\dots,n
$$

There is some hyperplane that (strictly) separates the data into positive and negative samples:

- $\vec\theta$ has positive margin $y_i\left<\vec\theta, \mathbf{x}_i\right> > 0~\forall i$
- Minimum margin: $\gamma=\min_{1\leq i\leq n} \left\{y_i\left<\vec\theta, \mathbf{x}_i\right>\right\}>0$

**$\gamma$-linear separatable**: The dataset $\mathcal{D}=\{(\mathbf{x}_i,y_i)\in \mathbb{R}^d\times \{-1,1\}:i=1,2,...n\}$ is $\gamma$-linearly separable for some $\gamma>0$ if there exists some $\vec{\theta}$ such that 

$$
y_i{\vec{\theta}}^\top\mathbf{x}_i\ge\gamma~\forall i=1,2,\dots,n
$$

**Geometric margin**: 

$$
\gamma_{\mathrm{geom}}:=\frac{\gamma}{\left\lVert\vec\theta\right\rVert}=\frac{\min_{1\leq i\leq n} y_i\mathbf{x}_i^\top\vec\theta}{\left\lVert\vec\theta\right\rVert}
$$

- This is the smallest distance over all samples to the decision boundary $L=\left\{\mathbf{x}\in \mathbb{R}^d: \left<\mathbf{x},\vec{\theta}\right>=0\right\}$
- $\gamma^{-1}_{\mathrm{geom}}$ : fair measure of the difficulty of the classification problem
- maximize the geometric margin $\Rightarrow$ more robust to noisy samples 

![Sample](image.png)

### Maximum margin linear classifier

For $\gamma$-linearly separable dataset, we need to solve the optimization problem:

$$
\begin{aligned}
&\max_{\vec\theta\in \mathbb{R}^d} \frac{\gamma}{\left\lVert\vec\theta\right\rVert} \text{ s.t. } \forall i=1,2,\dots,n,  y_i\mathbf{x}_i^\top \vec\theta\ge \gamma \\
\Leftrightarrow &\min_{\vec\theta\in \mathbb{R}^d} \frac{\left\lVert\vec\theta\right\rVert}{\gamma} \text{ s.t. } \forall i=1,2,\dots,n,  y_i\mathbf{x}_i^\top \vec\theta\ge \gamma
\end{aligned}
$$

since that $\gamma>0$ then we have 

$$
\min_{\vec\theta\in \mathbb{R}^d} \left\lVert\frac{\vec\theta}{\gamma}\right\rVert \text{ s.t. } \forall i=1,2,\dots,n,  y_i\mathbf{x}_i^\top \frac{\vec\theta}{\gamma} \ge 1
$$

Since that scaling $\vec\theta$ by a constant doest not change the decision boundary $L$ , we have let $\left\lVert\vec\theta\right\rVert=1$, then let $\vec\theta':=\frac{\vec\theta}{\gamma}$, optimizing $\vec\theta'\Leftrightarrow$ optimizing $\gamma$ .

缩放 $\vec\theta$ 不会对决策划线产生影响。

Then we have :

$$
\begin{aligned}
& \arg\min_{\vec\theta'\in \mathbb{R}^d} \left\lVert\vec\theta'\right\rVert \text{ s.t. } \forall i=1,2,\dots,n,  y_i\mathbf{x}_i^\top \vec\theta' \ge 1 \\
\Leftrightarrow& \arg\min_{\vec\theta'\in \mathbb{R}^d} \frac{1}{2}\left\lVert\vec\theta'\right\rVert^2 \text{ s.t. } \forall i=1,2,\dots,n,  y_i\mathbf{x}_i^\top \vec\theta' \ge 1 & \text{Primal form of SVM}
\end{aligned}
$$

## Primal-SVM

$$
\color{red}{
\arg\min_{\vec\theta'\in \mathbb{R}^d} \frac{1}{2}\left\lVert\vec\theta'\right\rVert^2 \text{ s.t. } \forall i=1,2,\dots,n,  y_i\mathbf{x}_i^\top \vec\theta' \ge 1}
$$

and the SVM algorithm is that finds the maximuim (geometric) margin linear classifier.

### Uniqueness

The solution to Primal-SVM is **unique**.

**Proof**: suppose there are $2$ distinct solution for primal-SVM $\vec\theta_1, \vec\theta_2$ and $\left\lVert\vec\theta_1\right\rVert=\left\lVert\vec\theta_2\right\rVert$, then let $\overline\theta=\frac{1}{2}\left(\vec\theta_1+\vec\theta_2\right)$ , then we have 

$$
\forall i=1,2,\dots,n, y_i\mathbf{x}_i^\top\overline{\theta}=\frac{1}{2}\left(y_i\mathbf{x}_i^\top\vec{\theta}_1+y_i\mathbf{x}_i\vec{\theta}_2\right)\ge 1
$$

Which leads to that $\overline{\theta}$ is feasible.

By triangle inequality, we have :

$$
\left\lVert\overline{\theta}\right\rVert=\frac{1}{2}\left\lVert\vec\theta_1+\vec\theta_2\right\rVert
\leq \frac{1}{2}\left\lVert\vec\theta_1\right\rVert + \frac{1}{2}\left\lVert\vec\theta_2\right\rVert
=\left\lVert\vec\theta_1\right\rVert
=\left\lVert\vec\theta_2\right\rVert
$$

- if $\left\lVert\overline{\theta}\right\rVert<\left\lVert\vec\theta_1\right\rVert$, this is a contradition 
- if $\left\lVert\overline{\theta}\right\rVert=\left\lVert\vec\theta_1\right\rVert$, this can only happen when $\vec\theta_1=\vec\theta_2$ .

$\text{Q.E.D}$

## Incorporating An Offset

If data are not "centered" at zero, we can incorporate an offset $\theta_0\in \mathbb{R}$ :

$$
f_{\vec\theta,\theta_0}(\mathbf{x})=\mathrm{sign}\left(\vec{\theta}^\top\mathbf{x}+\theta_0\right)
=\mathrm{sign}\left(
	\begin{bmatrix}
		\vec\theta \\
		\theta_0
	\end{bmatrix}^\top
	\begin{bmatrix}
		\mathbf{x} \\
		1
	\end{bmatrix}	
\right)
$$

Then the decision boundary is $L=\left\{\mathbf{x}\in\mathbb{R}^d: \vec{\theta}^\top\mathbf{x}+\theta_0=0\right\}$

Then the optimization problem becomes:

$$
\arg\min_{\left(\vec\theta',\theta_0'\right)\in \mathbb{R}^d\times\mathbb{R}} \frac{1}{2}\left\lVert\vec\theta'\right\rVert^2 \text{ s.t. } \forall i=1,2,\dots,n,  y_i\left(\mathbf{x}_i^\top \vec\theta'+\theta_0'\right) \ge 1
$$

**Remarks**:

- $\theta_0$ only appears in constrains. $\theta_0$ 只会出现在约束中.
- This is different from $\overline{\mathbf{x}}=\begin{bmatrix}\mathbf{x}&1\end{bmatrix}$ in linear regression. We do not bias in any way where the separating hyperplane should appear, only that it should maximize the geometric margin. 我们不预设分离超平面必须处于某个固定的位置（即不人为地“偏置”超平面的出现位置），而是完全依赖于最大化几何间隔这一原则来决定超平面的位置和方向。

Support Vectors:

- samples exactly on the margin
- Quatify the quality of this binary classifier

The solution of SVM depends on a small number of data samples $(\mathbf{x}_i, y_i)$ 只需要样本的特定的一小部分即可计算出SVM的解

![Sample](image-1.png)

## Evaluation

Let $\left(\vec\theta^t,\theta_0^t\right)$ be the parameters learnt from $\mathcal{D}\backslash\{(\mathbf{x}_t,y_t)\}$ i.e.

$$
\left(\vec\theta^t,\theta_0^t\right)=\arg\min_{\left(\vec\theta,\theta_0\right)\in\mathbb{R}^d\times\mathbb{R}}\left\{
	\frac{1}{2}
	\left\lVert\vec\theta\right\rVert^2 \text{ s.t. } 
	y_i\left(\mathbf{x}^\top\vec\theta+\theta_0\right)\ge 1~\forall i\in [1,n]\cap\mathbb{Z}\backslash\{t\}
\right\}
$$

**Leave-one-out cross-validation error (LOOCV)** : a value that can assess the robustness of the SVM :

$$
\mathrm{LOOCV}=\frac{1}{n}\sum_{t=1}^n
	\mathrm{Loss}\left(y_t,f_{\vec\theta^t,\theta_0^t}(\mathbf{x})\right)
$$

Where $\mathrm{Loss}(a,b)=\mathbb{I}\{a\ne b\}$

LOOCV is small, the model generalizes well.

Let $N\in\{0, 1, 2,\dots,n\}$ be the number of support vectors. Then we have:

$$
\mathrm{LOOCV}\leq \frac{N}{n}
$$

Hint: Only the support vectors can contribute to $\mathrm{LOOCV}$ .

## Allowing Misclassified Example

Permit some errors to increase robustness.

Let $\vec{\xi}=[\xi_1,\xi_2,\dots,\xi_n]~(\forall i=1,2,\dots,n, \xi_i\ge 0)$ be **slack variables**, and $C>0$ be pre-specified constant.

Then modify the problem to this:

$$
\begin{aligned}
& \arg\min_{
	\left(\vec\theta,\theta_0,\vec\xi\right)
	\in
	\mathbb{R}^d\times \mathbb{R}\times \mathbb{R}_+^n
}
\left\{
	\frac{1}{2}\left\lVert\vec{\theta}\right\rVert^2
	+C\sum_{i=1}^n \xi_i
	\text{ s.t. }
	\forall i\in\{1, 2, \dots, n\},
	y_i\left(\mathbf{x}_i^\top\vec\theta+\theta_0\right)\ge 1-\xi_i
\right\} \\
\Leftrightarrow
&\arg\min_{
	\left(\vec\theta,\theta_0\right)
	\in
	\mathbb{R}^d\times \mathbb{R}
}
\left\{
	\frac{1}{2}\left\lVert\vec\theta\right\rVert^2
	+C\sum_{i=1}^n \left[1-y_i\left(\mathbf{x}_i^\top\vec\theta+\theta_0\right)\right]^+
\right\}
\end{aligned}
$$

- The constrain is violated if some $\xi_i>0$ .
- Penalty for one violation: $C\xi_i$ .
- If $C\rightarrow \infty$, then $\xi_i\rightarrow 0$ , returns to the original max margin classifier.
- If $C\approx0$, some violation is allowed. 

![Sample](image-2.png)