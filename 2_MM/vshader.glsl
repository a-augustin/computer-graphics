#version 300 es
in vec2 aPosition;

uniform mat3 uModelMatrix;

void main()
{
    vec3 temp = uModelMatrix*vec3(aPosition,1.0);
    gl_Position = vec4(temp.xy,0.0,1.0);
}