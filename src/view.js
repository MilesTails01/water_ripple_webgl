import * as utils from './utils.js';
import logo from './img/logo.svg';

export class VIEW 
{
	constructor()
	{
		this.canvas 			= null;
		this.gl					= null;
		this.framebufferInfo	= {};
		this.mouseX 			= 0.0;
		this.mouseY 			= 0.0;
		this.mouseZ 			= 0.0;
		this.aspect				= 1;
		this.resolution 		= new Float32Array([0.0,0.0]);
	}

	init()
	{
		this.canvas 	= document.createElement('canvas');
		this.canvas.id	= "shader-canvas";
		this.gl			= this.canvas.getContext('webgl2');
		this.logo		= utils.htmlToElement(`<img src="${logo}" class="logo" />`);

		if (!this.gl) 											{ console.error('need webgl2'); 					}
		if (!this.gl.getExtension('EXT_color_buffer_float')) 	{ console.error('need EXT_color_buffer_float'); 	}
		if (!this.gl.getExtension('OES_texture_float_linear')) 	{ console.error('need OES_texture_float_linear'); 	}


		this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		document.body.appendChild(this.canvas);
		document.body.appendChild(this.logo);

		this.resize();
    	window.addEventListener('resize', this.resize.bind(this));

		this.canvas.addEventListener('mousemove', (event) => 
		{
			var rect 	= this.canvas.getBoundingClientRect();
			this.mouseX = event.clientX - rect.left;
			this.mouseY = event.clientY - rect.top;
		});

		this.canvas.addEventListener('mousedown'	, () => { this.mouseZ = 1.0; });
		this.canvas.addEventListener('mouseup'		, () => { this.mouseZ = 0.0; });
		this.canvas.addEventListener('pointerdown'	, () => { this.mouseZ = 1.0; });
		this.canvas.addEventListener('pointerup'	, () => { this.mouseZ = 0.0; });

		this.aspect			= this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;	
		this.resolution 	= new Float32Array([this.gl.canvas.clientWidth, this.gl.canvas.clientHeight]);

	}

	resize()
	{

		const gl				= this.gl;
		const pixelRatio 		= window.devicePixelRatio || 1;
		const displayWidth  	= Math.floor(window.innerWidth  * pixelRatio);
		const displayHeight 	= Math.floor(window.innerHeight * pixelRatio);
		// const reducedWidth  	= Math.floor(displayWidth * 0.5);
		// const reducedHeight 	= Math.floor(displayHeight * 0.5);
		const reducedWidth  	= Math.floor(displayWidth * 1.0);
		const reducedHeight 	= Math.floor(displayHeight * 1.0);

		

		if (this.canvas.width  !== displayWidth || 
			this.canvas.height !== displayHeight) 
		{
			this.canvas.width  	= displayWidth;
			this.canvas.height 	= displayHeight;
			this.aspect			= displayWidth / displayHeight;
			this.resolution 	= new Float32Array([this.gl.canvas.clientWidth, this.gl.canvas.clientHeight]);

			this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			

			for(let key in this.framebufferInfo)
			{
				
				const { framebuffer, texture } 	= this.framebufferInfo[key];
			
				gl.bindTexture			(gl.TEXTURE_2D, texture);
				gl.texImage2D			(gl.TEXTURE_2D, 0, gl.RGBA32F, reducedWidth, reducedHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				gl.bindTexture			(gl.TEXTURE_2D, null);
				gl.bindFramebuffer		(gl.FRAMEBUFFER, framebuffer);
				gl.framebufferTexture2D	(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
				gl.bindFramebuffer		(gl.FRAMEBUFFER, null);
			}


			gl.clear(gl.COLOR_BUFFER_BIT);

		}
	}

	createFramebuffer(width=this.gl.canvas.clientWidth, height=this.gl.canvas.clientHeight) 
	{
		const gl			= this.gl;
		const framebuffer	= gl.createFramebuffer();
		const texture 		= gl.createTexture();
		// const reducedWidth  = Math.floor(width * 0.5);
		// const reducedHeight = Math.floor(height * 0.5);
		const reducedWidth  = Math.floor(width * 1.0);
		const reducedHeight = Math.floor(height * 1.0);


		gl.bindTexture			(gl.TEXTURE_2D, texture);
		gl.texParameteri		(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri		(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri		(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri		(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D			(gl.TEXTURE_2D, 0, gl.RGBA32F, reducedWidth, reducedHeight, 0, gl.RGBA, gl.FLOAT, null);

		gl.bindFramebuffer		(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D	(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) 
		{
			console.error('Framebuffer is not complete!');
		}

		return { framebuffer, texture };
	}

	readPixels(x, y, width, height, framebuffer) 
	{
		const gl = this.gl;
		const pixels = new Uint8Array(width * height * 4);
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		
		return pixels;
	}
}