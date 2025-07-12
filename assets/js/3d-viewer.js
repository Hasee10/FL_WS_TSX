// ===== 3D VIEWER JAVASCRIPT =====

class Product3DViewer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            modelPath: '',
            texturePath: '',
            backgroundColor: 0xf0f0f0,
            cameraDistance: 5,
            autoRotate: true,
            autoRotateSpeed: 1,
            enableControls: true,
            enableZoom: true,
            enablePan: true,
            enableRotate: true,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        this.animationId = null;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded');
            return;
        }
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.setupEventListeners();
        
        if (this.options.modelPath) {
            this.loadModel();
        }
        
        this.animate();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(this.options.backgroundColor, 10, 50);
    }
    
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, this.options.cameraDistance);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for highlights
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, 10, -5);
        this.scene.add(pointLight);
        
        // Hemisphere light for better color balance
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        this.scene.add(hemisphereLight);
    }
    
    setupControls() {
        if (!this.options.enableControls) return;
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = this.options.enableZoom;
        this.controls.enablePan = this.options.enablePan;
        this.controls.enableRotate = this.options.enableRotate;
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = this.options.autoRotateSpeed;
        this.controls.maxDistance = 20;
        this.controls.minDistance = 2;
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle container resize
        const resizeObserver = new ResizeObserver(() => this.onWindowResize());
        resizeObserver.observe(this.container);
        
        // Mouse events for custom interactions
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Touch events for mobile
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.renderer.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.renderer.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }
    
    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            this.options.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Center and scale model
                this.centerModel();
                this.scaleModel();
                
                // Setup shadows
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Apply texture if available
                        if (this.options.texturePath && child.material) {
                            const textureLoader = new THREE.TextureLoader();
                            textureLoader.load(this.options.texturePath, (texture) => {
                                child.material.map = texture;
                                child.material.needsUpdate = true;
                            });
                        }
                    }
                });
                
                this.isLoaded = true;
                this.onModelLoaded();
            },
            (progress) => {
                this.onLoadProgress(progress);
            },
            (error) => {
                console.error('Error loading model:', error);
                this.onLoadError(error);
            }
        );
    }
    
    centerModel() {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
    }
    
    scaleModel() {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        
        this.model.scale.setScalar(scale);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        // Custom animations
        if (this.model && this.isLoaded) {
            this.updateModel();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateModel() {
        // Add any custom model animations here
        // For example, rotating parts, moving components, etc.
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    onMouseDown(event) {
        // Custom mouse down handling
    }
    
    onMouseMove(event) {
        // Custom mouse move handling
    }
    
    onMouseUp(event) {
        // Custom mouse up handling
    }
    
    onTouchStart(event) {
        // Custom touch start handling
    }
    
    onTouchMove(event) {
        // Custom touch move handling
    }
    
    onTouchEnd(event) {
        // Custom touch end handling
    }
    
    onModelLoaded() {
        // Trigger custom event
        this.container.dispatchEvent(new CustomEvent('model:loaded'));
    }
    
    onLoadProgress(progress) {
        // Update loading progress
        const percent = (progress.loaded / progress.total) * 100;
        this.container.dispatchEvent(new CustomEvent('model:progress', {
            detail: { percent }
        }));
    }
    
    onLoadError(error) {
        // Handle load error
        this.container.dispatchEvent(new CustomEvent('model:error', {
            detail: { error }
        }));
    }
    
    // Public methods
    setAutoRotate(enabled) {
        if (this.controls) {
            this.controls.autoRotate = enabled;
        }
    }
    
    setAutoRotateSpeed(speed) {
        if (this.controls) {
            this.controls.autoRotateSpeed = speed;
        }
    }
    
    resetCamera() {
        if (this.controls) {
            this.controls.reset();
        }
    }
    
    zoomIn() {
        if (this.controls) {
            this.controls.dollyIn(1.5);
            this.controls.update();
        }
    }
    
    zoomOut() {
        if (this.controls) {
            this.controls.dollyOut(1.5);
            this.controls.update();
        }
    }
    
    rotateTo(rotation) {
        if (this.model) {
            this.model.rotation.set(rotation.x, rotation.y, rotation.z);
        }
    }
    
    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
    }
    
    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL('image/png');
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
    }
}

// ===== PRODUCT CONFIGURATOR =====

class ProductConfigurator {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            models: {},
            materials: {},
            colors: {},
            ...options
        };
        
        this.currentModel = null;
        this.currentMaterial = null;
        this.currentColor = null;
        this.viewer = null;
        
        this.init();
    }
    
    init() {
        this.createUI();
        this.setupViewer();
        this.setupEventListeners();
    }
    
    createUI() {
        // Create configuration panel
        this.panel = document.createElement('div');
        this.panel.className = 'configurator-panel';
        
        // Model selection
        if (Object.keys(this.options.models).length > 0) {
            this.createModelSelector();
        }
        
        // Material selection
        if (Object.keys(this.options.materials).length > 0) {
            this.createMaterialSelector();
        }
        
        // Color selection
        if (Object.keys(this.options.colors).length > 0) {
            this.createColorSelector();
        }
        
        this.container.appendChild(this.panel);
    }
    
    createModelSelector() {
        const modelSection = document.createElement('div');
        modelSection.className = 'config-section';
        
        const title = document.createElement('h3');
        title.textContent = 'Select Model';
        modelSection.appendChild(title);
        
        const modelGrid = document.createElement('div');
        modelGrid.className = 'config-grid';
        
        Object.keys(this.options.models).forEach(modelKey => {
            const model = this.options.models[modelKey];
            const modelBtn = document.createElement('button');
            modelBtn.className = 'config-option';
            modelBtn.setAttribute('data-model', modelKey);
            
            if (model.thumbnail) {
                const img = document.createElement('img');
                img.src = model.thumbnail;
                img.alt = model.name;
                modelBtn.appendChild(img);
            }
            
            const label = document.createElement('span');
            label.textContent = model.name;
            modelBtn.appendChild(label);
            
            modelBtn.addEventListener('click', () => this.selectModel(modelKey));
            modelGrid.appendChild(modelBtn);
        });
        
        modelSection.appendChild(modelGrid);
        this.panel.appendChild(modelSection);
    }
    
    createMaterialSelector() {
        const materialSection = document.createElement('div');
        materialSection.className = 'config-section';
        
        const title = document.createElement('h3');
        title.textContent = 'Select Material';
        materialSection.appendChild(title);
        
        const materialGrid = document.createElement('div');
        materialGrid.className = 'config-grid';
        
        Object.keys(this.options.materials).forEach(materialKey => {
            const material = this.options.materials[materialKey];
            const materialBtn = document.createElement('button');
            materialBtn.className = 'config-option';
            materialBtn.setAttribute('data-material', materialKey);
            
            if (material.thumbnail) {
                const img = document.createElement('img');
                img.src = material.thumbnail;
                img.alt = material.name;
                materialBtn.appendChild(img);
            }
            
            const label = document.createElement('span');
            label.textContent = material.name;
            materialBtn.appendChild(label);
            
            materialBtn.addEventListener('click', () => this.selectMaterial(materialKey));
            materialGrid.appendChild(materialBtn);
        });
        
        materialSection.appendChild(materialGrid);
        this.panel.appendChild(materialSection);
    }
    
    createColorSelector() {
        const colorSection = document.createElement('div');
        colorSection.className = 'config-section';
        
        const title = document.createElement('h3');
        title.textContent = 'Select Color';
        colorSection.appendChild(title);
        
        const colorGrid = document.createElement('div');
        colorGrid.className = 'config-grid';
        
        Object.keys(this.options.colors).forEach(colorKey => {
            const color = this.options.colors[colorKey];
            const colorBtn = document.createElement('button');
            colorBtn.className = 'config-option color-option';
            colorBtn.setAttribute('data-color', colorKey);
            colorBtn.style.backgroundColor = color.value;
            
            const label = document.createElement('span');
            label.textContent = color.name;
            colorBtn.appendChild(label);
            
            colorBtn.addEventListener('click', () => this.selectColor(colorKey));
            colorGrid.appendChild(colorBtn);
        });
        
        colorSection.appendChild(colorGrid);
        this.panel.appendChild(colorSection);
    }
    
    setupViewer() {
        const viewerContainer = document.createElement('div');
        viewerContainer.className = 'viewer-container';
        this.container.appendChild(viewerContainer);
        
        this.viewer = new Product3DViewer(viewerContainer, {
            backgroundColor: 0xf5f5f5,
            autoRotate: true,
            autoRotateSpeed: 0.5
        });
    }
    
    setupEventListeners() {
        // Listen for model loaded events
        this.viewer.container.addEventListener('model:loaded', () => {
            this.updateConfiguration();
        });
    }
    
    selectModel(modelKey) {
        this.currentModel = modelKey;
        const model = this.options.models[modelKey];
        
        if (model.path) {
            this.viewer.options.modelPath = model.path;
            this.viewer.loadModel();
        }
        
        this.updateUI();
    }
    
    selectMaterial(materialKey) {
        this.currentMaterial = materialKey;
        this.updateConfiguration();
        this.updateUI();
    }
    
    selectColor(colorKey) {
        this.currentColor = colorKey;
        this.updateConfiguration();
        this.updateUI();
    }
    
    updateConfiguration() {
        if (!this.viewer.model) return;
        
        this.viewer.model.traverse((child) => {
            if (child.isMesh) {
                // Apply material
                if (this.currentMaterial) {
                    const material = this.options.materials[this.currentMaterial];
                    if (material && material.texture) {
                        const textureLoader = new THREE.TextureLoader();
                        textureLoader.load(material.texture, (texture) => {
                            child.material.map = texture;
                            child.material.needsUpdate = true;
                        });
                    }
                }
                
                // Apply color
                if (this.currentColor) {
                    const color = this.options.colors[this.currentColor];
                    if (color) {
                        child.material.color.setHex(color.value);
                        child.material.needsUpdate = true;
                    }
                }
            }
        });
    }
    
    updateUI() {
        // Update active states
        this.panel.querySelectorAll('.config-option').forEach(option => {
            option.classList.remove('active');
        });
        
        if (this.currentModel) {
            const modelBtn = this.panel.querySelector(`[data-model="${this.currentModel}"]`);
            if (modelBtn) modelBtn.classList.add('active');
        }
        
        if (this.currentMaterial) {
            const materialBtn = this.panel.querySelector(`[data-material="${this.currentMaterial}"]`);
            if (materialBtn) materialBtn.classList.add('active');
        }
        
        if (this.currentColor) {
            const colorBtn = this.panel.querySelector(`[data-color="${this.currentColor}"]`);
            if (colorBtn) colorBtn.classList.add('active');
        }
    }
    
    getConfiguration() {
        return {
            model: this.currentModel,
            material: this.currentMaterial,
            color: this.currentColor
        };
    }
    
    exportConfiguration() {
        const config = this.getConfiguration();
        const screenshot = this.viewer.takeScreenshot();
        
        return {
            ...config,
            screenshot,
            timestamp: new Date().toISOString()
        };
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D viewers
    const viewerContainers = document.querySelectorAll('.product-viewer');
    viewerContainers.forEach(container => {
        const modelPath = container.getAttribute('data-model');
        const texturePath = container.getAttribute('data-texture');
        
        new Product3DViewer(container, {
            modelPath,
            texturePath,
            autoRotate: true,
            autoRotateSpeed: 0.5
        });
    });
    
    // Initialize product configurators
    const configuratorContainers = document.querySelectorAll('.product-configurator');
    configuratorContainers.forEach(container => {
        const config = JSON.parse(container.getAttribute('data-config') || '{}');
        new ProductConfigurator(container, config);
    });
});

// ===== EXPORT FOR MODULE USE =====

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Product3DViewer,
        ProductConfigurator
    };
} 