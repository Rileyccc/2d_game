var gl;
var points;

var NumPoints = 5000;

window.onload = function init()
{
    var canvas = document.getElementById('canvas');
    var g1 = canvas.getContext('webgl')
    if ( !gl ) { 
        alert( "WebGL isn't available");
     	gl = canvas.getContext('experimental-webgl');
    }
    if (!gl){
        alert('your browser does not support webgl');
    }

    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0,0,canvas.width,canvas.height);


    //////////////////////////////////
	// create/compile/link shaders  //
	//////////////////////////////////
	program = initShadersFromFiles(gl, './shaders/vertex_shader.glsl','./shaders/fragement_shader.glsl');
    g1.useProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('error linking the program', gl.getProgramInfo(program) );
        return;
    }
}