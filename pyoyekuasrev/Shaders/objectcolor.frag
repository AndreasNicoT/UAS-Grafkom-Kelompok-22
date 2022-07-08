﻿#version 330

out vec4 outputColor;

uniform vec3 objColor;
//uniform vec3 lightcolor;

uniform vec3 lightPos;
uniform vec3 viewPos;
in vec3 Normal;


struct DirLight {
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

};

uniform DirLight dirLight;
vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir);


struct PointLight {
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform PointLight pointLight;
//vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 objColor, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - objColor);
    //diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    //specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0),256);
    //attenuation
    float distance    = length(light.position - objColor);
    float attenuation = 1.0 / (light.constant + light.linear * distance +light.quadratic * (distance * distance));
    //combine results
    vec3 ambient  = light.ambient  * objColor;
    vec3 diffuse  = light.diffuse  * diff * objColor;
    vec3 specular = light.specular * spec * objColor;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
} 
    

void main()
{
	//properties
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - objColor);
//	vec3 result = CalcDirLight(dirLight, norm, viewDir);
//	outputColor = vec4(result, 1.0);

    vec3 result = CalcPointLight(pointLight,norm,objColor,viewDir);
    outputColor = vec4(result, 1.0);
////    outputColor = vec4(objectcolor * lightcolor,1.0); 
//	float ambientStrenght = 0.2;
//	vec3 ambient = ambientStrenght * lightcolor;
//
//	vec3 norm = normalize(Normal);
//	vec3 lightDir = normalize(lightPos-FragPos);
//	float specularStrength = 0.5;
//	vec3 viewDir = normalize(viewPos-FragPos);
//	vec3 reflectDir = reflect(-lightDir,norm);
//	float spec = pow(max(dot(viewDir,reflectDir),0.0),256);
//	vec3 specular = specularStrength * spec *lightcolor;
////  vec3 result = ambient * objectcolor;
////  outputColor = vec4 (result,0.1);
//  
// 
//
//	float diff = max(dot(norm,lightDir),0.0);
//	vec3 diffuse = diff * lightcolor;
//
//	vec3 result = (ambient+diffuse+specular) * objectcolor;
//	outputColor = vec4(result,1.0);
}

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir){
		vec3 lightDir = normalize(-light.direction);
	    //diffuse shading
	    float diff = max(dot(normal, lightDir), 0.0);
	    //specular shading
	    vec3 reflectDir = reflect(-lightDir, normal);
	    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 256);
	    //combine results
	    vec3 ambient  = light.ambient  * objColor;
	    vec3 diffuse  = light.diffuse  * diff * objColor;
	    vec3 specular = light.specular * spec * objColor;
	    return (ambient + diffuse + specular);
}