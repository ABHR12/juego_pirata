var barco,barcoImg;
var barcoeneImg,m1,m2,m3;
var cofre,cofreImg,oro,oroImg;
var cielo,cieloImg;
var mar,marImg;
var tesoroGroup,mostersGroup,obsGroup;//grupos
var PLAY=1;
var END=0;
var gameState=PLAY;
var puntuacion = 0;
var restart,reiniciarImg,gameover,gameoverImg;



function preload(){//cargar imagenes y sonidos

    //cargar img cielo
    cieloImg=loadImage("cielo.jpg");

    //cargar img de mar 
    marImg=loadImage("mar.png");

    //cargar img del barco 
    barcoImg=loadImage("barco.png");

    //cargar img de barco_enemigo y obstaculos 
    barcoeneImg=loadImage("barco_enemigo.png");
    m1=loadImage("ms_marino.png");
    m2=loadImage("ms_marino2.png");
    m3=loadImage("ms_marino3.png");

    //cargra img de oro 
    oroImg=loadImage("oro.png");

    //cargar img de cofre
    cofreImg=loadImage("cofre.png");

    //caragr el game over y restart
    gameoverImg=loadImage("fin_juego.gif");
    reiniciarImg=loadImage("restart.png");


}

function setup() {//configuracion
    //canvas
    createCanvas(windowWidth,windowHeight);

    //crear cielo 
    cielo=createSprite(width/2,height-550,20,20);
    cielo.addImage("atardecer",cieloImg);
    cielo.scale=0.57; 
    
    //crear mar (ground)
    mar=createSprite(1210,height-92,20,20);
    mar.addImage("piso",marImg);
    mar.scale=0.39;

    //creacion del barco 
    barco=createSprite(200,450,200,200);
    barco.addImage("nave",barcoImg);
    barco.scale=0.3;
    barco.debug=false;
    barco.setCollider("rectangle",20,0,40,300);

    //creacion de gameover y restar
    gameover=createSprite(width/2,height/2 -200);
    gameover.addImage(gameoverImg);
    gameover.scale=2;
    gameover.visible=false;

    restart=createSprite(width/2,gameover.y +100,50,50);
    restart.addImage(reiniciarImg);
    restart.scale=0.8;
    restart.visible=false;

    //creacion de grupos...
    cofresGroup = new Group ();//grupo de cofres
    mostersGroup = new Group ();//grupo de mosters
    obsGroup = new Group ();// grupo de obstaculos 
    oroGroup = new Group();//grupo de monedas
    
 
}

function draw() {
    background("black");

    //GAME STATE
    if (gameState===PLAY){
        //velocidad de mar (piso)
         mar.velocityX=-2;  
        //crear movimiento del barco en y
        move();
        //crear mostruos
        moster();
        //colicion con los mounstros
        if (mostersGroup.isTouching(barco)){
            gameState=END;
        }
        //crear obstaculos
        obstaculo();
        if (obsGroup.isTouching(barco)){
            obsGroup.destroyEach();
            puntuacion=puntuacion-40;
        }
        //crear el tesoro
        cofre();
        if (cofresGroup.isTouching(barco)){
            cofresGroup.destroyEach();
            puntuacion=puntuacion+50;
        }
        //crear oro
        monedas();
        if (oroGroup.isTouching(barco)){
            oroGroup.destroyEach();
            puntuacion=puntuacion+100;
        }
        //piso infinito
        if (mar.x<500){
            mar.x=1200;
        }
        


    }else if (gameState===END){
        //detener velocidad
        mar.velocityX=0;
        //detener los mounstros
        mostersGroup.setVelocityXEach(0);
        //detener los tesoros
        cofresGroup.setVelocityXEach(0);
        oroGroup.setVelocityXEach(0);
        //detener los barcos enemigos 
        obsGroup.setVelocityXEach(0);

        //nunca llegar a 0 para no desaparecer los objetos al perder el juego 
        mostersGroup.setLifetimeEach(-1);
        cofresGroup.setLifetimeEach(-1);
        oroGroup.setLifetimeEach(-1);
        obsGroup.setLifetimeEach(-1);

            gameover.visible=true;
            restart.visible=true;
        if (mousePressedOver(restart)){
            reiniciar();
        }


    }
  
   

    

   //crear bordes
    bordes();

    drawSprites();
    textSize(20);
    fill(255);
    text("puntuacion: "+puntuacion,10,30);
}

function move(){//movimiento del barco en y
    
    //movimiento en y hacia arriba, limitando el borde
    if (keyDown("up") && barco.y >= 350){
        barco.y = barco.y -5;
    }

    //movimiento en y hacia abajo
    if (keyDown("down")){
        barco.y = barco.y +5;
    }
}
function bordes(){//bordes 

    edges= createEdgeSprites();
    barco.collide(edges);
    
}
function obstaculo(){//barco enemigo... obstaculos

    var dist=Math.round(random(700,height/2));
  if (frameCount % 330 === 0)
  {
      //crar barco enemigo
      barcoenemigo=createSprite(width,dist,200,200);
      //velocidad de barco enemigo 
      barcoenemigo.velocityX = -4;
      //pegar imagen del barco enemigo 
      barcoenemigo.addImage("obstaculo",barcoeneImg);
      //escala 
      barcoenemigo.scale = 0.3;
      //tiempo de via del barco enemigo 
      barcoenemigo.lifetime=400;
      //profundidad
      barco.depth=barcoenemigo.depth +1;
      obsGroup.add(barcoenemigo);
  }
     
        
}
function monedas(){//tesoros

    var distn=Math.round(random(700,height/2));
    if (frameCount % 420 == 0){
        oro=createSprite(width,distn,20,20);
        oro.addImage(oroImg);
        oro.scale=0.15;
        oro.velocityX = -3;
        oro.lifetime=520;
        barco.depth=oro.depth +1;
        oroGroup.add(oro);
    }

}
function moster(){//mostruos...obstaculos

    var distancia=Math.round(random(700,height/2));
    if (frameCount %410 == 0){
        mos=createSprite(width,distancia,20,20);
       mos.velocityX = -4;
       var mosnum=Math.round(random(1,3));
       switch(mosnum){
           case 1:
               mos.addImage(m1);
               mos.scale=0.18;
               break;
            case 2:
                mos.addImage(m2);
                mos.scale=0.16;
                break;
            case 3:
                mos.addImage(m3);
                mos.scale=0.21;
                break;
       }
       barco.depth=mos.depth +1;
       mostersGroup.add(mos);
    }
}
function cofre(){
    
    var dista=Math.round(random(700,height/2));
    if (World.frameCount % 490 == 0){
        var cofres = createSprite(width,dista,20,20);
        cofres.addImage(cofreImg);
        cofres.scale=0.15;
        cofres.velocityX=-3;
        cofres.lifetime=520;
        barco.depth=cofres.depth +1;
        cofresGroup.add(cofres)
    }
}
function reiniciar(){

    oroGroup.destroyEach();
    obsGroup.destroyEach();
    cofresGroup.destroyEach();
    mostersGroup.destroyEach();
    gameState=PLAY;
    puntuacion=0;
    gameover.visible=false;
    restart.visible=false;

}