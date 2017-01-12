var w=c.width=window.innerWidth,h=c.height=window.innerHeight,ctx=c.getContext("2d"),opts={color:"hsl(hue,100%,light%)",cx:w/2,cy:h/2},custom_fade_rate=1,custom_decay_factor=1,custom_speed_factor=1,custom_max_lines=300,custom_scale_factor=1,custom_pattern_size=1,custom_glowing_factor=1,custom_color_changing=1,custom_color_changing_old=1,custom_use_lines=!1,scale_factor=1200<w&&800<h?Math.sqrt(w/1200*h/800):1,hex_side_length=40*scale_factor*custom_scale_factor,point_size=scale_factor*custom_scale_factor*
2*custom_pattern_size,tick=0,color0=0,lines=[],special_lines=[],dieX=w/2/hex_side_length,dieY=h/2/hex_side_length,baseRad=2*Math.PI/6,unit_cell_w=3,unit_cell_h=Math.sqrt(3),sqrt3=Math.sqrt(3),crit_len=1.7,hex_x_list=[1,.5,-.5,-1,-.5,.5],hex_y_list=[0,sqrt3/2,sqrt3/2,0,-sqrt3/2,-sqrt3/2],hex_rad_list=[0,1,2,3,4,5],last_time_explosion=0,explosion_lock=!1,last_time_sporadic=0,sporadic_interval=260*Math.random()+100|0,sporadic_duration=180*Math.random()+100|0,sporadic_spawning=!1,sporadic_min_dist=20,
audio_lf=0,audio_hf=0,mouse_x=opts.cx,mouse_y=opts.cy,sporadic_spawn_x=opts.cx,sporadic_spawn_y=opts.cy;ctx.fillStyle="black";ctx.fillRect(0,0,w,h);var update_globals=function(){hex_side_length=40*scale_factor*custom_scale_factor;point_size=scale_factor*custom_scale_factor*2*custom_pattern_size;dieX=w/2/hex_side_length;dieY=h/2/hex_side_length};c.onmousemove=function(a){mouse_x=a.pageX;mouse_y=a.pageY};
var audioMaxSample=10,audioSample_lf=0,audioSample_hf=0,audioProcess=function(a){audio_lf=audio_hf=0;half_sample=a.length/4;for(var b=0;b<half_sample;b++)audio_lf+=a[b]+a[b+2*half_sample],audio_hf+=a[b+half_sample]+a[b+3*half_sample];audioSample_lf=((audioMaxSample-1)*audioSample_lf+audio_lf)/audioMaxSample;audioSample_hf=((audioMaxSample-1)*audioSample_hf+audio_hf)/audioMaxSample};window.wallpaperRegisterAudioListener(audioProcess);
window.wallpaperPropertyListener={applyUserProperties:function(a){a.custom_scale_factor&&(custom_scale_factor=a.custom_scale_factor.value/100,update_globals());a.custom_max_lines&&(custom_max_lines=a.custom_max_lines.value);a.custom_fade_rate&&(custom_fade_rate=a.custom_fade_rate.value/100);a.custom_use_lines&&(custom_use_lines=a.custom_use_lines.value);a.custom_pattern_size&&(custom_pattern_size=a.custom_pattern_size.value/100,update_globals());a.custom_glowing_factor&&(custom_glowing_factor=a.custom_glowing_factor.value/
100);a.custom_decay_factor&&(custom_decay_factor=a.custom_decay_factor.value/100);a.custom_speed_factor&&(custom_speed_factor=a.custom_speed_factor.value/100);a.custom_color_changing&&(custom_color_changing=a.custom_color_changing.value/100,color0+=.1*tick*(custom_color_changing_old-custom_color_changing),custom_color_changing_old=custom_color_changing)}};var dist=function(a,b,d,e){return Math.sqrt((a-d)*(a-d)+(b-e)*(b-e))};
function loop(){window.requestAnimationFrame(loop);++tick;ctx.globalCompositeOperation="source-over";ctx.shadowBlur=0;ctx.fillStyle="rgba(0,0,0,alp)".replace("alp",.036*custom_fade_rate);ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation="lighter";lines.length<custom_max_lines&&1>Math.random()&&lines.push(new Line("normal"));if(!explosion_lock&&29<audio_lf+audio_hf&&audio_lf+audio_hf>1.5*(audioSample_lf+audioSample_hf)&&20<tick-last_time_explosion){for(var a=0;100>a;a++)special_lines.push(new Line("explosion"));
last_time_explosion=tick;explosion_lock=!0}explosion_lock&&25>audioSample_hf+audioSample_lf&&(explosion_lock=!1);if(sporadic_spawning||.1>Math.random()&&0==audio_lf&&0==audio_hf&&tick-last_time_sporadic>sporadic_interval)sporadic_spawning||(sporadic_spawn_x=Math.random()*w,sporadic_spawn_y=Math.random()*h,dist(sporadic_spawn_x,sporadic_spawn_y,mouse_x,mouse_y)>sporadic_min_dist*hex_side_length&&(sporadic_spawning=!0,last_time_sporadic=tick)),sporadic_spawning&&(special_lines.push(new Line("sporadic")),
tick-last_time_sporadic>sporadic_duration&&(sporadic_spawning=!1,sporadic_interval=260*Math.random()+100|0,sporadic_duration=180*Math.random()+100|0,last_time_sporadic=tick));for(a=0;a<lines.length;)lines[a].step(),lines[a].finished?lines.splice(a,1):++a;for(a=0;a<special_lines.length;)special_lines[a].step(),special_lines[a].finished?special_lines.splice(a,1):++a}function Line(a){this.reset(a)}
Line.prototype.reset=function(a){this.mode=a;this.lifespan=300/custom_decay_factor|0;"sporadic"==this.mode&&(this.lifespan=600/custom_decay_factor|0);this.finished=!1;var b=(mouse_x-opts.cx)/hex_side_length,d=(mouse_y-opts.cy)/hex_side_length;this.origin_x=b;this.origin_y=d;"sporadic"==this.mode&&(b=(sporadic_spawn_x-opts.cx)/hex_side_length,d=(sporadic_spawn_y-opts.cy)/hex_side_length);var e=Math.floor(b/unit_cell_w);a=Math.floor(d/unit_cell_h);b-=e*unit_cell_w;d-=a*unit_cell_h;d>sqrt3*b&&d<-sqrt3*
b+sqrt3?(e=e*unit_cell_w-.5,a=a*unit_cell_h+sqrt3/2):d>=-sqrt3*b+2*sqrt3&&d<=sqrt3*b-sqrt3?(e=e*unit_cell_w+2.5,a=a*unit_cell_h+sqrt3/2):d>=sqrt3/2?(e=e*unit_cell_w+1,a=a*unit_cell_h+sqrt3):(e=e*unit_cell_w+1,a*=unit_cell_h);hex_point_index=6*Math.random()|0;this.x=hex_x_list[hex_point_index]+e;this.y=hex_y_list[hex_point_index]+a;this.last_loc_x=opts.cx+this.x*hex_side_length;this.last_loc_y=opts.cy+this.y*hex_side_length;this.addedY=this.addedX=0;this.rad=baseRad*(2*(3*Math.random()|0)+1+hex_rad_list[hex_point_index]);
this.shaking=0;this.lightInputMultiplier=.01+.02*Math.random();"sporadic"==this.mode&&(this.lightInputMultiplier=.03+.03*Math.random());this.color=opts.color.replace("hue",.1*tick*custom_color_changing+color0);this.cumulativeTime=0;this.beginPhase()};
Line.prototype.beginPhase=function(){this.x+=this.addedX;this.y+=this.addedY;this.time=0;this.targetTime="explosion"==this.mode?(4+2*Math.random())/custom_speed_factor|0:"sporadic"==this.mode?(25+25*Math.random())/custom_speed_factor|0:(10+10*Math.random())/custom_speed_factor|0;var a=Math.atan2(this.y-this.origin_y,this.x-this.origin_x),b=Math.cos(this.rad+baseRad-a),a=Math.cos(this.rad-baseRad-a),d=1*(b+1)/(b+a+2);"sporadic"==this.mode&&(d=1*(b+2.5)/(b+a+5));this.rad+=baseRad*(Math.random()<d?1:
-1);this.addedX=Math.cos(this.rad);this.addedY=Math.sin(this.rad);if(.015>Math.random()||this.cumulativeTime>=this.lifespan||this.x>dieX||this.x<-dieX||this.y>dieY||this.y<-dieY)this.finished=!0};
Line.prototype.step=function(){++this.time;++this.cumulativeTime;this.time>=this.targetTime&&this.beginPhase();var a=this.time/this.targetTime,b=Math.sin(a*Math.PI/2),d=this.addedX*b,e=this.addedY*b,b=Math.exp(-this.cumulativeTime/90*custom_decay_factor),f=((custom_use_lines?20:30)+10*Math.sin(this.cumulativeTime*this.lightInputMultiplier)+7*(audio_hf+.2*audio_lf))*b;ctx.shadowBlur=12*a*custom_scale_factor*custom_glowing_factor;"explosion"==this.mode?(b=Math.exp(-this.cumulativeTime/(custom_use_lines?
30:40)*custom_decay_factor),f=100*b):"sporadic"==this.mode&&(b=Math.exp(-this.cumulativeTime/175*custom_decay_factor),f=(6+2*Math.sin(this.cumulativeTime*this.lightInputMultiplier))*b);ctx.fillStyle=ctx.shadowColor=this.color.replace("light",f);a=opts.cx+(this.x+d)*hex_side_length;d=opts.cy+(this.y+e)*hex_side_length;b*=(audio_lf+.2*audio_hf)/32*hex_side_length*Math.random()*(.5>Math.random()?1:-1);this.shaking=b<this.shaking-.08*hex_side_length?this.shaking-.08*hex_side_length:b>this.shaking+.08*
hex_side_length?this.shaking+.08*hex_side_length:b;e=point_size*(audio_hf/40+1);"sporadic"==this.mode&&(this.shaking=0,e=point_size);var f=a+Math.sin(this.rad)*this.shaking,g=d+Math.cos(this.rad)*this.shaking;custom_use_lines?(ctx.beginPath(),ctx.strokeStyle=ctx.fillStyle,ctx.lineWidth=e,ctx.moveTo(this.last_loc_x,this.last_loc_y),ctx.lineTo(f,g),ctx.stroke()):ctx.fillRect(f,g,e,e);Math.random()<(.1+b/2/hex_side_length)*custom_scale_factor&&ctx.fillRect(a+Math.random()*(hex_side_length/2+b)*(.5>Math.random()?
1:-1),d+Math.random()*(hex_side_length/2+b)*(.5>Math.random()?1:-1),point_size,point_size);this.last_loc_x=f;this.last_loc_y=g};loop();window.addEventListener("resize",function(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;scale_factor=1200<w&&800<h?Math.sqrt(w/1200*h/800):1;update_globals();ctx.fillStyle="black";ctx.fillRect(0,0,w,h);opts.cx=w/2;opts.cy=h/2});