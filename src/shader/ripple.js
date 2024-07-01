import { ShaderLib } from "./shaderLib";

export const VS = `#version 300 es
	in vec4 a_position;
	out vec2 fragCoord;
	
	void main() 
	{
		gl_Position 	= a_position;
		vec4 	pos 	= a_position;
				pos.xy 	= pos.xy * 0.5 + 0.5;
		fragCoord 		= pos.xy;
	}
`;

export const FS = `#version 300 es
	precision highp float;
	uniform float u_aspectRatio;
	uniform vec2 u_resolution;
	uniform float time;
	uniform vec3 u_mouse;
	uniform sampler2D u_texture;

	#define STRENGTH_COEFFICIENT 	(1.75)
	#define MODIFIER_COEFFICIENT 	(0.99)
	#define SAMPLE_STEP         	(4)
	#define SURFACE_DEPTH       	(12.)
	#define SPECULAR_REFLECTION  	(12.)

	in vec2 fragCoord;
	out vec4 fragColor;

	${ShaderLib.viewMatrix}

	float delta 	= 1.3;

	void main() 
	{
		ivec2 uv		= ivec2(fragCoord * u_resolution);
	// 	vec2 mouse		= u_mouse.xy / 2.0;
		vec2 mouse		= u_mouse.xy;
	// 	mouse.x			= mouse.x * ( u_aspectRatio / 2.0);
		mouse.y			= u_resolution.y - mouse.y;
		float dist 		= distance(fragCoord * u_resolution, mouse);
		float force		= texelFetch(u_texture, uv, 0).x;
		float velo 		= texelFetch(u_texture, uv, 0).y;

		float rgt		= texelFetch(u_texture, uv + ivec2( SAMPLE_STEP,  0), 0).r;
		float lft		= texelFetch(u_texture, uv + ivec2(-SAMPLE_STEP,  0), 0).r;
		float upw		= texelFetch(u_texture, uv + ivec2( 0,  SAMPLE_STEP), 0).r;
		float dwn		= texelFetch(u_texture, uv + ivec2( 0, -SAMPLE_STEP), 0).r;

//		if (fragCoord.x * u_resolution.x == 0.5) 						lft = rgt;
//		if (fragCoord.x * u_resolution.x == u_resolution.x - 0.5) 		rgt = lft;
//		if (fragCoord.y * u_resolution.y == 0.5) 						dwn = upw;
//		if (fragCoord.y * u_resolution.y == u_resolution.y - 0.5) 		upw = dwn;

		velo 			+= delta * (-2.0 * force + rgt 	+ lft) / 4.0;
		velo 			+= delta * (-2.0 * force + upw 	+ dwn) / 4.0;
		force 			+= delta * velo;
		velo 			-= 0.004 * delta * force;
		velo 			*= 1.0 - 0.004 * delta;
		force 			*= 0.98;
		fragColor.xyzw	= vec4(force, velo, (rgt - lft) / 2.0, (upw - dwn) / 2.0);

		if (dist < 10.0 * u_mouse.z) 
		{
			fragColor.x += 1.0 - dist / 10.0;
    	}
	}
`;