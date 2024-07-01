export class Shader
{
	constructor(gl, vertexSource, fragmentSource) 
	{
        this.gl 		= gl;
        this.program 	= this.createProgram(vertexSource, fragmentSource);
    }
	
	createShader(type, source) 
	{
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) 
		{
            console.error('Error compiling shader:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

	createProgram(vertexSource, fragmentSource) 
	{
        let program 		= this.gl.createProgram();
        let vertexShader 	= this.createShader(this.gl.VERTEX_SHADER	, vertexSource		);
        let fragmentShader	= this.createShader(this.gl.FRAGMENT_SHADER	, fragmentSource	);

        if (vertexShader && fragmentShader) 
		{
            this.gl.attachShader(program, vertexShader);
            this.gl.attachShader(program, fragmentShader);
            this.gl.linkProgram(program);

            if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) 
			{
                console.error('Error linking program:', this.gl.getProgramInfoLog(program));
                this.gl.deleteProgram(program);
                return null;
            }

            this.gl.detachShader(program, vertexShader);
            this.gl.detachShader(program, fragmentShader);
            this.gl.deleteShader(vertexShader);
            this.gl.deleteShader(fragmentShader);

            return program;
        }
        return null;
    }

	use() 
	{
        this.gl.useProgram(this.program);
    }
}