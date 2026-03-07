// SummerEcho 官网交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Lucide 图标
    lucide.createIcons();
    
    // 初始化星空背景
    initStarfield();
    
    // 初始化导航栏滚动效果
    initNavbar();
    
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化表单
    initForm();
    
    // 初始化滚动动画
    initScrollAnimations();
});

// 星空背景动画
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let shootingStars = [];
    
    // 设置画布大小
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }
    
    // 初始化星星
    function initStars() {
        stars = [];
        const numStars = Math.min(Math.floor((width * height) / 4000), 200);
        
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random(),
                speed: Math.random() * 0.02 + 0.005,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    
    // 创建流星
    function createShootingStar() {
        if (Math.random() < 0.005) { // 0.5% 概率每帧
            shootingStars.push({
                x: Math.random() * width,
                y: 0,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 10 + 10,
                angle: Math.random() * Math.PI / 4 + Math.PI / 4,
                opacity: 1,
                life: 1
            });
        }
    }
    
    // 绘制星星
    function drawStar(star) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // 添加光晕效果
        if (star.radius > 1) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`;
            ctx.fill();
        }
    }
    
    // 绘制流星
    function drawShootingStar(star) {
        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;
        
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 头部光点
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    // 更新星星
    function updateStars() {
        stars.forEach(star => {
            // 闪烁效果
            star.opacity += star.twinkleSpeed * star.twinkleDirection;
            if (star.opacity >= 1) {
                star.opacity = 1;
                star.twinkleDirection = -1;
            } else if (star.opacity <= 0.2) {
                star.opacity = 0.2;
                star.twinkleDirection = 1;
            }
            
            // 缓慢移动
            star.y += star.speed;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
        });
    }
    
    // 更新流星
    function updateShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.life -= 0.02;
            star.opacity = star.life;
            
            if (star.life <= 0 || star.x > width || star.y > height) {
                shootingStars.splice(i, 1);
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // 绘制所有星星
        stars.forEach(drawStar);
        
        // 创建和绘制流星
        createShootingStar();
        shootingStars.forEach(drawShootingStar);
        
        // 更新
        updateStars();
        updateShootingStars();
        
        requestAnimationFrame(animate);
    }
    
    // 鼠标交互
    let mouseX = 0, mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 附近的星星变亮
        stars.forEach(star => {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                star.opacity = Math.min(1, star.opacity + 0.1);
            }
        });
    });
    
    // 初始化
    resize();
    window.addEventListener('resize', resize);
    animate();
}

// 导航栏滚动效果
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// 移动端菜单
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // 切换图标
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'menu');
        } else {
            icon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });
    
    // 点击链接后关闭菜单
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = menuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 表单处理
function initForm() {
    const form = document.getElementById('betaForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        // 模拟提交
        const button = form.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '提交中...';
        button.disabled = true;
        
        setTimeout(() => {
            // 显示成功消息
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // 重置表单
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
            
            // 3秒后恢复表单
            setTimeout(() => {
                form.style.display = 'block';
                successMessage.classList.add('hidden');
            }, 3000);
            
            console.log('Beta signup:', email);
        }, 1000);
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('section h2, section p, .feature-card, .scenario-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面可见性变化处理（节省资源）
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面不可见时暂停动画
        console.log('Page hidden, animations paused');
    } else {
        // 页面可见时恢复动画
        console.log('Page visible, animations resumed');
    }
});
