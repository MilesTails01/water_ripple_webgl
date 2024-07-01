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
		vec3 	top 		= vec3(0.31, 0.0, 0.0); // vec3(0.11);
		vec3 	bottom 		= vec3(0.49, 0.0, 0.0); // vec3(0.09);
	//	vec2 	uv 			= fragCoord.xy * u_aspectRatio;
		vec2 	uv 			= fragCoord.xy;
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
		//////////////////////////////////////////////////
		//	SNOW EFFECT									//
		//												//
		//	credit goes to: Emil 2016-01-12				//
		//												//
		//////////////////////////////////////////////////
		float snow = 0.0;
		for (int k = 0; k < 8; k++) 
		{
    	for (int i = 0; i < 4; i++) 
		{
			float	size		= 2.0 + float(i) * 8.0;
			float	fallSpeed	= 0.2;
			vec2	uv			= fragCoord.xy;
					uv.x		= uv.x * u_aspectRatio;
					uv			+= vec2(0.01 * sin((time + float(k * 6789)) * 0.6 + float(i)) * (5.0 / float(i)), fallSpeed * (time + float(k * 1234)) * (1.0 / float(i)));
			vec2	uvStep		= (ceil((uv) * size - vec2(0.5, 0.5)) / size);
			float	x			= fract(sin(dot(uvStep.xy, vec2(12.3456 + float(k) * 12.0, 78.999 + float(k) * 345.123)))	* 43758.5453 + float(k) * 12.0) - 0.5;
			float	y			= fract(sin(dot(uvStep.xy, vec2(67.8999 + float(k) * 23.0, 99.999 + float(k) * 99.0)))		* 62159.8432 + float(k) * 12.0) - 0.5;
			float	amp1		= sin(time * 2.0) * 0.5 / size;
			float	amp2		= cos(time * 2.0) * 0.5 / size;
			float	dist		= 1.0 * distance((uvStep.xy + vec2(x * sin(y), y) * amp1 + vec2(y, x) * amp2), uv.xy);
			float	omiVal		= fract(sin(dot(uvStep.xy, vec2(32.4691, 94.615))) * 31572.1684);
			if (omiVal < 0.08) 
			{
				float newd		= (x + 1.0) * 0.4 * clamp(1.9 - dist * (15.0 + (x * 6.3)) * (size / 1.4), 0.0, 1.0);
				snow += newd;
			}
    	}
		}
		fragColor = vec4((color * vec3(0.7,.0,.0) + snow * 1.4) / 1.5 * fade + bg, 1.0);
		//	fragColor = vec4(color / 1.5 * fade + bg, 1.0);
		//	fragColor = vec4(uv, 0.0, 1.0);
	}
`;