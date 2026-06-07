// ============================================
// ANNIVERSARY EXPERIENCE - THREE.JS
// Ultra clean & beautiful code
// ============================================

class AnniversaryExperience {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentScene = 'intro';
        this.flowers = [];
        this.particles = [];
        this.candles = [];
        this.deviceRotation = { beta: 0, gamma: 0 };
        this.hasDeviceOrientation = false;

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        const container = document.getElementById('canvas-container');

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff69b4, 1.5);
        pointLight.position.set(0, 5, 5);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupEventListeners() {
        document.getElementById('btnYes').addEventListener('click', () => this.goToFlowers());
        document.getElementById('btnNo').addEventListener('click', () => this.doNothingNo());
        window.addEventListener('deviceorientation', (e) => this.handleDeviceOrientation(e));
    }

    handleDeviceOrientation(event) {
        this.hasDeviceOrientation = true;
        this.deviceRotation.beta = event.beta || 0;
        this.deviceRotation.gamma = event.gamma || 0;
    }

    doNothingNo() {
        const questionBox = document.querySelector('.question-box');
        const randomX = (Math.random() - 0.5) * 80;
        const randomY = (Math.random() - 0.5) * 80;
        questionBox.style.transform = `translate(${randomX}vw, ${randomY}vh)`;
        questionBox.style.transition = 'transform 0.3s ease-out';
    }

    goToFlowers() {
        this.currentScene = 'flowers';
        document.getElementById('introScene').classList.add('hidden');
        this.scene.clear();
        this.createFlowerField();
        this.createAnniversaryMessage();
    }

    createFlowerField() {
        const flowerCount = 15;
        const positions = this.generateFlowerPositions(flowerCount);

        positions.forEach((pos, index) => {
            setTimeout(() => {
                const flower = this.createFlower(pos);
                this.flowers.push(flower);
                this.scene.add(flower);
            }, index * 150);
        });

        // Directional light for flowers
        const light = new THREE.DirectionalLight(0x22ff22, 2);
        light.position.set(5, 10, 5);
        light.castShadow = true;
        this.scene.add(light);

        // Ambient green glow
        const ambientLight = new THREE.AmbientLight(0x22ff22, 1.2);
        this.scene.add(ambientLight);
    }

    generateFlowerPositions(count) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push({
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 15
            });
        }
        return positions;
    }

    createFlower(position) {
        const flower = new THREE.Group();

        // Stem
        const stemGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x22ff22 });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.y = -1;
        flower.add(stem);

        // Petals
        const petalCount = 6;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalGeom = new THREE.SphereGeometry(0.4, 16, 16);
            const petalMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.3, 1, 0.5),
                emissive: 0x22ff22,
                emissiveIntensity: 0.5
            });
            const petal = new THREE.Mesh(petalGeom, petalMat);
            petal.position.x = Math.cos(angle) * 1;
            petal.position.y = Math.sin(angle) * 1;
            petal.scale.set(0.8, 1, 0.8);
            flower.add(petal);
        }

        // Center
        const centerGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const centerMat = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.8
        });
        const center = new THREE.Mesh(centerGeom, centerMat);
        center.position.z = 0.3;
        flower.add(center);

        flower.position.copy(position);
        flower.scale.set(0, 0, 0);

        // Animate entrance
        const startTime = Date.now();
        const duration = 1500;
        const animateGrow = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            flower.scale.set(progress, progress, progress);
            flower.rotation.z += 0.01;

            if (progress < 1) {
                requestAnimationFrame(animateGrow);
            }
        };
        animateGrow();

        return flower;
    }

    createAnniversaryMessage() {
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = 'bold 180px Arial';
            ctx.fillStyle = '#ff69b4';
            ctx.textAlign = 'center';
            ctx.fillText('Joyeux Anniversaire', 1024, 200);

            ctx.font = 'bold 120px Arial';
            ctx.fillStyle = '#22ff22';
            ctx.fillText('ma Reine 👑', 1024, 350);

            const texture = new THREE.CanvasTexture(canvas);
            const geom = new THREE.PlaneGeometry(20, 5);
            const mat = new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0xff69b4,
                emissiveIntensity: 0.5
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.z = 5;
            mesh.position.y = 6;

            mesh.scale.set(0, 0, 1);
            const startTime = Date.now();
            const duration = 800;
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                mesh.scale.set(progress, progress, 1);
                mesh.rotation.z = (1 - progress) * 0.2;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            animate();

            this.scene.add(mesh);
        }, 1500);

        // After flowers, show candle scene
        setTimeout(() => {
            this.createCandleScene();
        }, 4000);
    }

    createCandleScene() {
        this.currentScene = 'candle';
        document.getElementById('candleHint').classList.remove('hidden');

        this.scene.clear();
        this.flowers = [];

        const light = new THREE.PointLight(0xffa500, 2);
        light.position.set(0, 5, 5);
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Cake
        const cakeGeom = new THREE.CylinderGeometry(2, 2, 0.8, 32);
        const cakeMat = new THREE.MeshStandardMaterial({ color: 0xd2691e });
        const cake = new THREE.Mesh(cakeGeom, cakeMat);
        cake.position.y = 0;
        this.scene.add(cake);

        // Create 19 candles
        for (let i = 0; i < 19; i++) {
            const angle = (i / 19) * Math.PI * 2;
            const radius = 1.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            this.createCandle({ x, y: 0.8, z }, true);
        }

        // Interact with device orientation
        if (this.hasDeviceOrientation) {
            document.getElementById('orientationHint').classList.remove('hidden');
        }

        // Audio hint for blowing
        document.addEventListener('click', () => this.blowCandles());
    }

    createCandle(position, lit = true) {
        const candle = new THREE.Group();

        // Wax
        const waxGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
        const waxMat = new THREE.MeshStandardMaterial({ color: 0xfffacd });
        const wax = new THREE.Mesh(waxGeom, waxMat);
        wax.position.y = 0.3;
        candle.add(wax);

        // Flame
        const flameGroup = new THREE.Group();
        if (lit) {
            const flame = this.createFlame();
            flameGroup.add(flame);
        }
        flameGroup.position.y = 0.9;
        candle.add(flameGroup);

        candle.position.set(position.x, position.y, position.z);
        candle.userData.flameGroup = flameGroup;
        candle.userData.lit = lit;

        this.candles.push(candle);
        this.scene.add(candle);

        return candle;
    }

    createFlame() {
        const flameGeom = new THREE.ConeGeometry(0.15, 0.5, 8);
        const flameMat = new THREE.MeshStandardMaterial({
            color: 0xff6b00,
            emissive: 0xffa500,
            emissiveIntensity: 2
        });
        const flame = new THREE.Mesh(flameGeom, flameMat);
        flame.userData.baseScale = 1;
        return flame;
    }

    blowCandles() {
        if (this.currentScene !== 'candle') return;

        let allOut = true;
        this.candles.forEach(candle => {
            if (candle.userData.lit) {
                allOut = false;
                candle.userData.flameGroup.clear();
                candle.userData.lit = false;

                // Smoke effect
                this.createSmoke(candle.position);
            }
        });

        if (allOut) {
            this.goToHeartScene();
        }
    }

    createSmoke(position) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const smokeGeom = new THREE.SphereGeometry(0.1, 8, 8);
                const smokeMat = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    transparent: true,
                    opacity: 0.5
                });
                const smoke = new THREE.Mesh(smokeGeom, smokeMat);
                smoke.position.copy(position);
                smoke.position.x += (Math.random() - 0.5) * 0.5;
                smoke.position.z += (Math.random() - 0.5) * 0.5;

                this.scene.add(smoke);

                const startTime = Date.now();
                const duration = 2000;
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;

                    smoke.position.y += 0.01;
                    smokeMat.opacity = 0.5 * (1 - progress);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        this.scene.remove(smoke);
                    }
                };
                animate();
            }, i * 200);
        }
    }

    goToHeartScene() {
        this.currentScene = 'heart';
        document.getElementById('candleHint').classList.add('hidden');
        document.getElementById('introScene').classList.add('hidden');

        this.scene.clear();
        this.candles = [];

        const light = new THREE.PointLight(0xff69b4, 3);
        light.position.set(0, 5, 5);
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        const heart = this.createHeart();
        this.scene.add(heart);

        // Create finale message
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = 'bold 100px Arial';
            ctx.fillStyle = '#ff69b4';
            ctx.textAlign = 'center';
            ctx.fillText('À la plus belle femme du monde', 1024, 180);

            ctx.font = 'bold 140px Arial';
            ctx.fillStyle = '#ff1493';
            ctx.fillText('Joyeux Anniversaire! 🎉', 1024, 380);

            const texture = new THREE.CanvasTexture(canvas);
            const geom = new THREE.PlaneGeometry(20, 5);
            const mat = new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0xff69b4,
                emissiveIntensity: 0.8
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.z = 5;
            mesh.position.y = -4;

            this.scene.add(mesh);
        }, 1000);
    }

    createHeart() {
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;

        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y + 0, x + 0, y + 0);
        heartShape.bezierCurveTo(x - 6, y + 0, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y + 0, x + 9, y + 0);
        heartShape.bezierCurveTo(x + 5, y + 0, x + 5, y + 5, x + 5, y + 5);

        const geometry = new THREE.ShapeGeometry(heartShape);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff1493,
            emissive: 0xff69b4,
            emissiveIntensity: 2,
            metalness: 0.3,
            roughness: 0.4
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.3, 0.3, 1);
        mesh.position.z = 0;

        // Animate heart
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % 1000) / 1000;

            mesh.scale.set(
                0.3 + Math.sin(progress * Math.PI * 2) * 0.05,
                0.3 + Math.sin(progress * Math.PI * 2) * 0.05,
                1
            );
            mesh.rotation.z = Math.sin(progress * Math.PI * 2) * 0.05;

            requestAnimationFrame(animate);
        };
        animate();

        return mesh;
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animate flowers
        this.flowers.forEach(flower => {
            flower.rotation.y += 0.005;
            flower.rotation.x += 0.002;

            if (this.hasDeviceOrientation && this.currentScene === 'flowers') {
                const beta = (this.deviceRotation.beta / 90) * 0.5;
                const gamma = (this.deviceRotation.gamma / 90) * 0.5;
                this.camera.rotation.x = beta;
                this.camera.rotation.z = gamma;
            }
        });

        // Animate candle flames
        this.candles.forEach(candle => {
            if (candle.userData.lit && candle.userData.flameGroup.children.length > 0) {
                const flame = candle.userData.flameGroup.children[0];
                flame.scale.y = 0.8 + Math.sin(Date.now() * 0.005) * 0.3;
                flame.scale.x = 0.8 + Math.sin(Date.now() * 0.003) * 0.3;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AnniversaryExperience();
});
