import { ShaderLib } from "./shaderLib";

export const VS = `#version 300 es
	in vec4 a_position;
	out vec2 fragCoord;
	void main() {
		gl_Position = a_position;

		vec4 	pos 	= a_position;
				pos.xy 	= pos.xy * 0.5 + 0.5;
				// pos.y	= pos.y * 0.5;
				// pos.z = 0.5 * pos.z - 0.5 * pos.w;
				// pos.w = pos.w;

		fragCoord = pos.xy;
	}
`;

export const FS = `#version 300 es
	precision mediump float;
	uniform float u_aspectRatio;
	uniform vec2 u_resolution;
	uniform vec3 u_lightDir;
	uniform float time;
	uniform sampler2D u_texture;

	in vec2 fragCoord;
	out vec4 fragColor;

	
	float widthFactor 	= 2.0;

	vec3 calcSine(vec2 uv, float speed, float frequency, float amplitude, float shift, float offset, vec3 color, float width, float exponent, bool dir)
	{
		float angle 		= time * speed * frequency * -1.0 + (shift + uv.x) * 2.0;
		float y 			= sin(angle) * amplitude + offset;
		float clampY 		= clamp(0.0, y, y);
		float diffY 		= y - uv.y;
		float dsqr 			= distance(y, uv.y);
		float scale 		= 1.0;
		
		/**/ if( dir && diffY > 0.0) { dsqr = dsqr * 4.0; }
		else if(!dir && diffY < 0.0) { dsqr = dsqr * 4.0; }
		
		scale 				= pow(smoothstep(width * widthFactor, 0.0, dsqr), exponent);
		return min(color * scale, color);
	}

	float rand(vec2 uv) 
	{
   		return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453 );
	}

	void main( )
	{
		vec3 	top 		= vec3(0.11);
		vec3 	bottom 		= vec3(0.09);
		vec2 	uv 			= fragCoord.xy * u_aspectRatio;
		vec3 	tex 		= texture(u_texture, fragCoord).rgb / 2.0;
			 	uv			= uv + tex.xy;
		vec3 	bg 			= vec3(mix(bottom, top, uv.y));
		vec3 	color 		= vec3(0.0);
		float 	fade		= 1.0;
//		float 	noiseScale 	= 1.0;
//		float 	dithStr		= 0.2;
//		vec3	dither		= vec3(rand(uv * noiseScale + vec2(time * 0.1)));
//				bg 			= mix(bg, bg + dither * dithStr, 0.5);

		//	uv, speed, frequency, amplitude, shift, offset, color, width, exponent, dir
			color += calcSine(uv, 0.2, 0.20, 0.20, 0.0, 0.5, vec3(0.3, 0.3, 0.3), 0.1, 15.0,false);
			color += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.5, vec3(0.3, 0.3, 0.3), 0.1, 17.0,false);
			color += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.5, vec3(0.3, 0.3, 0.3), 0.05, 23.0,false);
			color += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.3, vec3(0.3, 0.3, 0.3), 0.1, 17.0,true);
			color += calcSine(uv, 0.5, 0.36, 0.40, 0.0, 0.3, vec3(0.3, 0.3, 0.3), 0.2, 17.0,true);
			color += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.3, vec3(0.3, 0.3, 0.3), 0.05, 23.0,true);
			color += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.3, vec3(0.3, 0.3, 0.3), 0.2, 15.0,true);

		if(time < 1.0)
		fade = smoothstep(0.0, 1.0, time);

		fragColor = vec4(color * fade + bg, 1.0);
	}
`;