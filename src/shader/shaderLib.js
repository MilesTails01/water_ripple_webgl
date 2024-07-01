export class ShaderLib
{
	static mat = `
	struct Mat4x4 { vec4 mx; vec4 my; vec4 mz; vec4 mw; };
    struct Mat4x3 { vec4 mx; vec4 my; vec4 mz; };
    struct Mat4x2 { vec4 mx; vec4 my; };

	vec3 Mat4x3GetCol0(Mat4x3 m) { return vec3(m.mx.x, m.my.x, m.mz.x); }
    vec3 Mat4x3GetCol1(Mat4x3 m) { return vec3(m.mx.y, m.my.y, m.mz.y); }
    vec3 Mat4x3GetCol2(Mat4x3 m) { return vec3(m.mx.z, m.my.z, m.mz.z); }
    vec3 Mat4x3GetCol3(Mat4x3 m) { return vec3(m.mx.w, m.my.w, m.mz.w); }

	vec4 Mul(Mat4x4 m, vec4 v) { return vec4(dot(m.mx, v), dot(m.my, v), dot(m.mz, v), dot(m.mw, v)); }
	vec3 Mul(Mat4x3 m, vec4 v) { return vec3(dot(m.mx, v), dot(m.my, v), dot(m.mz, v)); }
	vec2 Mul(Mat4x2 m, vec4 v) { return vec2(dot(m.mx, v), dot(m.my, v)); }

	vec4 Mul(vec3 v, Mat4x3 m) 
	{
		return vec4(	dot(Mat4x3GetCol0(m), v),
						dot(Mat4x3GetCol1(m), v),
						dot(Mat4x3GetCol2(m), v),
						dot(Mat4x3GetCol3(m), v));
	}
	`;

	static saturate = `
    float saturate(float v) { return clamp(v, 0.0, 1.0); }
    vec2 saturate(vec2 v) { return clamp(v, vec2(0.0), vec2(1.0)); }
    vec3 saturate(vec3 v) { return clamp(v, vec3(0.0), vec3(1.0)); }
    vec4 saturate(vec4 v) { return clamp(v, vec4(0.0), vec4(1.0)); }
    `;

	static invlerp = `
    float invlerp(float a, float b, float v) { return (v - a) / (b - a); }
    `;

	static lerp = `
    float lerp(float a, float b, float t) { return a + t * (b - a); }
	vec3  lerp(vec3  a, vec3  b, float t) { return a + t * (b - a); }
	`;

	static viewMatrix = `
	mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) 
	{
		vec3 f = normalize(center - eye);
		vec3 s = normalize(cross(f, up));
		vec3 u = cross(s, f);
		return mat4
		(
			vec4(s, 0.0),
			vec4(u, 0.0),
			vec4(-f, 0.0),
			vec4(0.0, 0.0, 0.0, 1)
		);
	}
	`;

	static blend = `
	vec4 blend( float a, float b, vec3 colA, vec3 colB, float k )
	{
    	float h 		= clamp( 0.5 + 0.5 * (b - a) / k, 0.0, 1.0 );
    	float blendDst 	= lerp( b, a, h ) - k*h*(1.0-h);
    	vec3 blendCol	= lerp(colB, colA, h);
    	return vec4(blendCol, blendDst);
	}
	`;

	static toLinear = `
	vec3 toLinear(vec3 c)
	{    
		c.x = pow(c.x, 2.2);
		c.y = pow(c.y, 2.2);
		c.z = pow(c.z, 2.2);
		
		return c;
	}
	`;

	static toSRGB = `
	vec3 toSRGB(vec3 c)
	{    
		c.x = pow(c.x, 1.0 / 2.2);
		c.y = pow(c.y, 1.0 / 2.2);
		c.z = pow(c.z, 1.0 / 2.2);
		
		return c;
	}
	`;
}