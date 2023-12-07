var canvas;
var gl;
var angle = 0.0;

class Drawable{
    constructor(tx,ty,scale,rotation){
    	this.tx = tx;
    	this.ty = ty;
    	this.scale = scale;
    	this.modelRotation = rotation;
    	this.initializeModelMatrix();
    }
    	
    initializeModelMatrix(){
    	let t = mat3(1, 0, this.tx,
    		     0, 1, this.ty,
    		     0, 0, 1);
    	let s = mat3(this.scale, 0, 0,
    		     0, this.scale, 0,
    		     0, 0, 1);
    	let rad = radians(this.modelRotation);
    	
    	let r = mat3(Math.cos(rad), -Math.sin(rad), 0,
    		    Math.sin(rad), Math.cos(rad), 0,
    		    0, 0, 1);
	
	this.modelMatrix = mult(t,mult(s,r));
    }
    
    getModelMatrix(){
    	return this.modelMatrix;
    }
    
    setModelMatrix(mm){
    	this.modelMatrix = mm;
    }
}

var squares = [];

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    for(var i = 0; i < 4; i++)
    	squares.push(new Square2D(2*Math.random()-1,2*Math.random()-1, 0.5,20));
    
    render();
};

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    for(var i = 0; i <squares.length; i++){
        squares[i].draw();
    }
}


