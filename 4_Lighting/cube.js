class Cube extends Drawable{
    static vertexPositions = [
    	vec3(-0.5,-0.5,0.5),
    	vec3(-0.5,0.5,0.5),
    	vec3(0.5,0.5,0.5),
    	vec3(0.5,-0.5,0.5),
    	vec3(-0.5,-0.5,-0.5),
    	vec3(-0.5,0.5,-0.5),
    	vec3(0.5,0.5,-0.5),
    	vec3(0.5,-0.5,-0.5),
    ];
   static vertexColors = [
   	vec4(1.0, 0.0, 0.0, 1.0),  // red
   	vec4(1.0, 0.0, 1.0, 1.0),  // magenta
   	vec4(1.0, 1.0, 1.0, 1.0),  // white
   	vec4(1.0, 1.0, 0.0, 1.0),  // yellow
   	vec4(0.0, 0.0, 0.0, 1.0),  // black
   	vec4(0.0, 0.0, 1.0, 1.0),  // blue
   	vec4(0.0, 1.0, 1.0, 1.0),  // cyan
   	vec4(0.0, 1.0, 0.0, 1.0)   // green
    ];
    
    static vertexNormals = [];

    static indices = [
	0,3,2,
	0,2,1,
	2,3,7,
	2,7,6, 
	0,4,7,
	0,7,3,
	1,2,6,
	1,6,5,
	4,5,6,
	4,6,7,
	0,1,5,
	0,5,4
    ];

    static positionBuffer = -1;
    static colorBuffer = -1;
    static indexBuffer = -1;
    static normalBuffer = -1;
    
    static shaderProgram = -1;
    static aPositionShader = -1;
    static aColorShader = -1;
    static aNormalShader = -1;
    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;
    
    static uMatAmbientShader = -1;
    static uMatDiffuseShader = -1;
    static uMatSpecularShader = -1;
    static uMatAlphaShader = -1;
    
    static uLightDirectionShader = -1;
    static uLightAmbientShader = -1;
    static uLightDiffuseShader = -1;
    static uLightSpecularShader = -1;
    
    static computeNormals(){
	var normalSum = [];
	var counts = [];
	
	//initialize sum of normals for each vertex and how often its used.
	for (var i = 0; i<Cube.vertexPositions.length; i++) {
	    normalSum.push(vec3(0, 0, 0));
	    counts.push(0);
	}
	
	//for each triangle
	for (var i = 0; i<Cube.indices.length; i+=3) {
	    var a = Cube.indices[i];
	    var b = Cube.indices[i+1];
	    var c = Cube.indices[i+2];
	    
	    var edge1 = subtract(Cube.vertexPositions[b],Cube.vertexPositions[a])
	    var edge2 = subtract(Cube.vertexPositions[c],Cube.vertexPositions[b])
	    var N = cross(edge1,edge2)
	    
	    normalSum[a] = add(normalSum[a],normalize(N));
	    counts[a]++;
	    normalSum[b] = add(normalSum[b],normalize(N));
	    counts[b]++;
	    normalSum[c] = add(normalSum[c],normalize(N));
	    counts[c]++;
	
	}
		
	for (var i = 0; i < Cube.vertexPositions.length; i++)
	    this.vertexNormals[i] = mult(1.0/counts[i],normalSum[i]);
    }

    
    static initialize() {
        Cube.computeNormals();
    	Cube.shaderProgram = initShaders( gl, "/vshader.glsl", "/fshader.glsl");
		
	// Load the data into the GPU
	Cube.positionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, Cube.positionBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Cube.vertexPositions), gl.STATIC_DRAW );
	
	Cube.colorBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, Cube.colorBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Cube.vertexColors), gl.STATIC_DRAW );
	
	Cube.normalBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, Cube.normalBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Cube.vertexNormals), gl.STATIC_DRAW );
	
	Cube.indexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Cube.indexBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(Cube.indices), gl.STATIC_DRAW );
		
	// Associate our shader variables with our data buffer
	Cube.aPositionShader = gl.getAttribLocation( Cube.shaderProgram, "aPosition" );
	Cube.aColorShader = gl.getAttribLocation( Cube.shaderProgram, "aColor" );
	Cube.aNormalShader = gl.getAttribLocation( Cube.shaderProgram, "aNormal" );
	
	Cube.uModelMatrixShader = gl.getUniformLocation( Cube.shaderProgram, "modelMatrix" );
	Cube.uCameraMatrixShader = gl.getUniformLocation( Cube.shaderProgram, "cameraMatrix" );
	Cube.uProjectionMatrixShader = gl.getUniformLocation( Cube.shaderProgram, "projectionMatrix" );
	
	Cube.uMatAmbientShader = gl.getUniformLocation( Cube.shaderProgram, "matAmbient" );
	Cube.uMatDiffuseShader = gl.getUniformLocation( Cube.shaderProgram, "matDiffuse" );
	Cube.uMatSpecularShader = gl.getUniformLocation( Cube.shaderProgram, "matSpecular" );
	Cube.uMatAlphaShader = gl.getUniformLocation( Cube.shaderProgram, "matAlpha" );
	
	Cube.uLightDirectionShader = gl.getUniformLocation( Cube.shaderProgram, "lightDirection" );
	Cube.uLightAmbientShader = gl.getUniformLocation( Cube.shaderProgram, "lightAmbient" );
	Cube.uLightDiffuseShader = gl.getUniformLocation( Cube.shaderProgram, "lightDiffuse" );
	Cube.uLightSpecularShader = gl.getUniformLocation( Cube.shaderProgram, "lightSpecular" );
	
    }
    	
    constructor(tx,ty,tz,scale,rotX,rotY,rotZ,amb,dif,sp,sh){
        super(tx,ty,tz,scale,rotX,rotY,rotZ,amb,dif,sp,sh);
        if(Cube.shaderProgram == -1)
            Cube.initialize()
        
    }
    
    draw() {
    
        gl.useProgram(Cube.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, Cube.positionBuffer);
       	gl.vertexAttribPointer(Cube.aPositionShader, 3, gl.FLOAT, false, 0, 0 );
       	
       	gl.bindBuffer( gl.ARRAY_BUFFER, Cube.colorBuffer);
       	gl.vertexAttribPointer(Cube.aColorShader, 4, gl.FLOAT, false, 0, 0 );
       	
       	gl.bindBuffer( gl.ARRAY_BUFFER, Cube.normalBuffer);
       	gl.vertexAttribPointer(Cube.aNormalShader, 3, gl.FLOAT, false, 0, 0 );
       	
	gl.uniformMatrix4fv(Cube.uModelMatrixShader, false, flatten(this.modelMatrix));
	gl.uniformMatrix4fv(Cube.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
	gl.uniformMatrix4fv(Cube.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));
	
	gl.uniform4fv(Cube.uMatAmbientShader, this.matAmbient);
	gl.uniform4fv(Cube.uMatDiffuseShader, this.matDiffuse);
	gl.uniform4fv(Cube.uMatSpecularShader, this.matSpecular);
	gl.uniform1f(Cube.uMatAlphaShader, this.matAlpha);
	
	
	gl.uniform3fv(Cube.uLightDirectionShader, light1.direction);
	gl.uniform4fv(Cube.uLightAmbientShader, light1.ambient);
	gl.uniform4fv(Cube.uLightDiffuseShader, light1.diffuse);
	gl.uniform4fv(Cube.uLightSpecularShader, light1.specular);
		
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Cube.indexBuffer);
	
	gl.enableVertexAttribArray(Cube.aPositionShader);    
	gl.enableVertexAttribArray(Cube.aColorShader);
	gl.enableVertexAttribArray(Cube.aNormalShader);    
    	gl.drawElements(gl.TRIANGLES, Cube.indices.length, gl.UNSIGNED_BYTE, 0);
    	gl.disableVertexAttribArray(Cube.aPositionShader);    
    	gl.disableVertexAttribArray(Cube.aColorShader);    
    	gl.disableVertexAttribArray(Cube.aNormalShader);    
    }
}

