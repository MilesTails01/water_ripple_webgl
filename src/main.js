import './css/style.css';

import { VIEW } 	from './view.js';
import { Shader } 	from './shader';
import * as Dune 	from './shader/dunes.js';
import * as Ripple 	from './shader/ripple.js';

const 	view 	= new VIEW();
		view.init();

const	shader	= new Shader(view.gl, Ripple.VS, Ripple.FS);
const 	shader2 = new Shader(view.gl, Dune.VS, Dune.FS);

		shader.use();

let aspectRatio 	= view.gl.canvas.clientWidth / view.gl.canvas.clientHeight;
let resolution 		= new Float32Array([view.canvas.clientWidth, view.canvas.clientHeight]);
let lightPos		= new Float32Array([-5.0, 5.0, 2.0]);
let orbitPos		= new Float32Array([0.0, 0.0, 5.0]);
let positionBuffer 	= view.gl.createBuffer();
let positions 		= [	-1.0, -1.0,
						 1.0, -1.0,
						-1.0,  1.0,
						-1.0,  1.0,
						 1.0, -1.0,
						 1.0,  1.0];

view.gl.bindBuffer(view.gl.ARRAY_BUFFER, positionBuffer);
view.gl.bufferData(view.gl.ARRAY_BUFFER, new Float32Array(positions), view.gl.STATIC_DRAW);

view.gl.uniform1f(	view.gl.getUniformLocation(	shader.program, "u_aspectRatio")	, aspectRatio);
view.gl.uniform2fv(	view.gl.getUniformLocation(	shader.program, "u_resolution")		, resolution);
view.gl.uniform3fv(	view.gl.getUniformLocation(	shader.program, "u_lightPos")		, lightPos);
view.gl.uniform3fv(	view.gl.getUniformLocation(	shader.program, "u_orbitPos")		, orbitPos);
view.gl.uniform1f(	view.gl.getUniformLocation(	shader.program, "time")				, 0.0);
view.gl.uniform2f(	view.gl.getUniformLocation(	shader.program, "u_mouse")			, view.mouseX, view.mouseY);

view.framebufferInfo[0]	= view.createFramebuffer(view.gl.canvas.clientWidth, view.gl.canvas.clientHeight);
view.framebufferInfo[1]	= view.createFramebuffer(view.gl.canvas.clientWidth, view.gl.canvas.clientHeight);
const aspLocation		= view.gl.getUniformLocation(shader.program, "u_aspectRatio")
const resLocation		= view.gl.getUniformLocation(shader.program, "u_resolution")
const timeLocation		= view.gl.getUniformLocation(shader.program, "time");
const aspLocationB		= view.gl.getUniformLocation(shader2.program, "u_aspectRatio")
const resLocationB		= view.gl.getUniformLocation(shader2.program, "u_resolution")
const timeLocationB		= view.gl.getUniformLocation(shader2.program, "time");
const mouseLocation		= view.gl.getUniformLocation(shader.program, "u_mouse");
const positionLocation 	= view.gl.getAttribLocation(shader.program, "a_position");

// view.gl.bindTexture(view.gl.TEXTURE_2D, null);
view.gl.enableVertexAttribArray(positionLocation);
view.gl.vertexAttribPointer(positionLocation, 2, view.gl.FLOAT, false, 0, 0);
// view.gl.drawArrays(view.gl.TRIANGLES, 0, 6);


let readFramebufferInfo		= view.framebufferInfo[0];
let writeFramebufferInfo 	= view.framebufferInfo[1];

function render(time) 
{
//	const reducedResolution = [view.resolution[0] * 0.5, view.resolution[1] * 0.5];
	const reducedResolution = [view.resolution[0] * 1.0, view.resolution[1] * 1.0];

	//	=====================
	//	|	FIRST BUFFER	|
	//	=====================
	view.gl.bindFramebuffer	(view.gl.FRAMEBUFFER, writeFramebufferInfo.framebuffer);
	view.gl.viewport		(0, 0, reducedResolution[0], reducedResolution[1]);
	view.gl.useProgram		(shader.program);
	view.gl.uniform1f		(aspLocation	, view.aspect);
	view.gl.uniform1f		(timeLocation 	, time * 0.001);
	view.gl.uniform3f		(mouseLocation	, view.mouseX, view.mouseY, view.mouseZ);
	view.gl.uniform2fv		(resLocation	, reducedResolution);
	view.gl.activeTexture	(view.gl.TEXTURE0);
	view.gl.bindTexture		(view.gl.TEXTURE_2D, readFramebufferInfo.texture);
	view.gl.uniform1i		(view.gl.getUniformLocation(shader.program, 'u_texture'), 0);
	view.gl.drawArrays		(view.gl.TRIANGLES, 0, 6);
	view.gl.bindFramebuffer	(view.gl.FRAMEBUFFER, null);
	view.gl.viewport		(0, 0, view.resolution[0], view.resolution[1]);
	view.gl.drawArrays		(view.gl.TRIANGLES, 0, 6);

	[readFramebufferInfo, writeFramebufferInfo] = [writeFramebufferInfo, readFramebufferInfo];
	

//	const pixelData = view.readPixels(400, 400, 1, 1, writeFramebufferInfo.texture);
//	console.log(`R: ${pixelData[0]}, G: ${pixelData[1]}, B: ${pixelData[2]}, A: ${pixelData[3]}`);

	//	=====================
	//	|	SECOND BUFFER	|
	//	=====================
	shader2.use();
	view.gl.uniform1f		(aspLocationB	, view.aspect);
	view.gl.uniform1f		(timeLocationB 	, time * 0.001);
	view.gl.uniform2fv		(resLocationB	, view.resolution);
	view.gl.activeTexture	(view.gl.TEXTURE0);
	view.gl.bindTexture		(view.gl.TEXTURE_2D, writeFramebufferInfo.texture);
	view.gl.uniform1i		(view.gl.getUniformLocation(shader2.program, 'u_texture'), 0);
	view.gl.bindFramebuffer	(view.gl.FRAMEBUFFER, null);
	view.gl.drawArrays		(view.gl.TRIANGLES, 0, 6);




	requestAnimationFrame(render);
}



requestAnimationFrame(render);