/**
 *
 * Felhasználói funkciók
 *
 * @author Edem
 * @version 1.0
 */

/* Az adatszerkezeti táblázat egy sorát tárolja */
function adatSzerkSor(){
  /* Adott sorból betölti az adatokat */
	this.setDatas = function(sorId){
	  this.funkcio = document.getElementById("funk"+sorId).value.trim();
    this.azon = document.getElementById("azon"+sorId).value.trim();
	  this.tipus = document.getElementById("tipus"+sorId).selectedIndex;
	  this.jellegI = document.getElementById("checkI"+sorId).checked;
		this.jellegO = document.getElementById("checkO"+sorId).checked;
		this.jellegM = document.getElementById("checkM"+sorId).checked;
	};
}
 
/* Adatszerkezeti táblázat elemei, funkciói */
adatSzerk = {
  /* adatokat tartalmazó sorok száma */
  sorokSzama: 0,
	/* adatokat tartalmazó sorok alapján AdatSzerkSor objektumokat tartalmazó tömb */
	sorok:[],
	/* ellenõrzõ függvény tárolása késleltetett hívásnál (megszûntetéshez) */
  ellen:0,
	/* minden adat megfelelõ? */
	hasError: false,
	
	/* egy sor valamely elemének kijelölésekor fut le */ 
	sorKijelol: function(sorId,element){
	  /* nem minden böngészõ jelöli ki a checkboxot rákattintáskor */
	  if (typeof(element) != "undefined" && element.type == "checkbox"){
	   element.focus();
	  }
		clearTimeout(adatSzerk.ellen);
		document.getElementById("adatszerkCim").style.backgroundImage = "none";
	  
		/* ha az utolsó sor akkor beszúrás */
		if (sorId >= adatSzerk.sorokSzama){
		  adatSzerk.sorok[sorId] = new adatSzerkSor();
		  //bovites
		  adatSzerk.sorokSzama++;
		  var tabla = document.getElementById("adatSzerkTabla");
			var sor = tabla.insertRow(sorId+3);
			sor.setAttribute("align","center");
			sor.setAttribute("id","sor"+(sorId+1));
			var oszlopok = tabla.rows[2].cells.length;
 
      for(var i=0; i<oszlopok; i++) {
			  var newcell = sor.insertCell(i);
        newcell.innerHTML = tabla.rows[sorId+2].cells[i].innerHTML;
			  switch(i){
				  case 0:
				    newcell.childNodes[0].setAttribute("id","funk"+(sorId+1));
						newcell.childNodes[0].value = "";
						newcell.childNodes[0].setAttribute("onfocus","adatSzerk.sorKijelol("+(sorId+1)+",this);");
						newcell.childNodes[0].setAttribute("onblur","adatSzerk.sorKijelolSzunt("+(sorId+1)+");");
						break;
					case 1:
					  newcell.childNodes[0].setAttribute("id","azon"+(sorId+1));
						newcell.childNodes[0].value = "";
						newcell.childNodes[0].setAttribute("onfocus","adatSzerk.sorKijelol("+(sorId+1)+",this);");
						newcell.childNodes[0].setAttribute("onblur","adatSzerk.sorKijelolSzunt("+(sorId+1)+");");
						 
						break;
					case 2:  
						for( var j=0; j<newcell.childNodes.length; j++){
						  if (newcell.childNodes[j].type == "select-one"){
						    newcell.childNodes[j].selectedIndex = 0;
                newcell.childNodes[j].setAttribute('id',"tipus"+(sorId+1));
								newcell.childNodes[j].setAttribute("onfocus","adatSzerk.sorKijelol("+(sorId+1)+",this);");
								newcell.childNodes[j].setAttribute("onblur","adatSzerk.sorKijelolSzunt("+(sorId+1)+");");
							}
						}
						break;
					case 3:
						for( var j=0; j<newcell.childNodes.length; j++){
						  if (newcell.childNodes[j].type == "checkbox"){
							  if (newcell.childNodes[j].getAttribute("id") == ("checkI"+(sorId))){
								  newcell.childNodes[j].setAttribute('id',"checkI"+(sorId+1));
								}
								if (newcell.childNodes[j].getAttribute("id") == ("checkO"+(sorId))){
								  newcell.childNodes[j].setAttribute('id',"checkO"+(sorId+1));
								}
								if (newcell.childNodes[j].getAttribute("id") == ("checkM"+(sorId))){
								  newcell.childNodes[j].setAttribute('id',"checkM"+(sorId+1));
								}
								newcell.childNodes[j].setAttribute("onclick","adatSzerk.sorKijelol("+(sorId+1)+",this);");
								newcell.childNodes[j].setAttribute("onblur","adatSzerk.sorKijelolSzunt("+(sorId+1)+");");
							}
						}
						break;
					case 4:
					  for( var j=0; j<newcell.childNodes.length; j++){
						  if (typeof(newcell.childNodes[j].src) != "undefined"){
							  newcell.childNodes[j].setAttribute("id","torles"+(sorId+1));
								newcell.childNodes[j].setAttribute("onclick","adatSzerk.sorEllen("+(sorId+1)+");");
							}
						}
					  newcell.setAttribute("bgcolor","white");
						document.getElementById("torles"+sorId).style.visibility = "visible";
					  break;
				}
			}
		}	 
	},
	
	/* kijelölés megszûnésekor ellenõrzõ metódus hívás késleltetve */ 
	sorKijelolSzunt: function(sorId){
	  document.getElementById("adatszerkCim").style.backgroundImage = "url('pics/loading.gif')";
	  adatSzerk.ellen = setTimeout("adatSzerk.sorEllen()",1000);
	},
	
	/* ellenõrzõ fgv: sorok mentése, üres sorok törlése, hiba jelzés */ 
	sorEllen: function(sorId){
	  if (typeof(sorId) != "undefined"){
			adatSzerk.sorUrit(sorId);
		}
		adatSzerk.hasError = false;
		/* ellenõrzés - üres sorok törlése */
    for( var i=0; i<adatSzerk.sorokSzama; i++){
			if (adatSzerk.sorUres(i)){
			  /* ures a sor - törlés */
				var lepes = 1;
				while ((lepes+i)<adatSzerk.sorokSzama-1 && adatSzerk.sorUres(i+lepes)) lepes++;

				/* sorok masolása */
				for( var j=i; j<adatSzerk.sorokSzama-lepes+1; j++){
					adatSzerk.sorMasol(j+lepes,j);
				}
				
				/* felesleges sorok törlése */
				for( var j=adatSzerk.sorokSzama; j>adatSzerk.sorokSzama-lepes; j--){
					adatSzerk.sorTorol(j);
				}
				adatSzerk.sorokSzama-=lepes;
					 
				if (adatSzerk.sorokSzama>0){
					if (adatSzerk.sorUres(adatSzerk.sorokSzama) && adatSzerk.sorUres(adatSzerk.sorokSzama-1)){
						adatSzerk.sorTorol(adatSzerk.sorokSzama);
					  adatSzerk.sorokSzama--;
					}
				} 
        document.getElementById("torles"+adatSzerk.sorokSzama).style.visibility = "hidden";
			}	
			
			document.getElementById("funk"+i).value=document.getElementById("funk"+i).value.trim();
			document.getElementById("azon"+i).value=document.getElementById("azon"+i).value.trim(); 
			
			/* setData */
			adatSzerk.sorok[i].setDatas(i);
			
			if (adatSzerk.sorokSzama > 0){
				if (adatSzerk.sorHianyos(i) == true){
					document.getElementById("sor"+i).bgColor = "#ffcaca";
					document.getElementById("funk"+i).style.backgroundColor = "#ffcaca";
					document.getElementById("azon"+i).style.backgroundColor = "#ffcaca";
					document.getElementById("tipus"+i).style.backgroundColor = "#ffcaca";
					adatSzerk.hasError = true;
				}else{
				  document.getElementById("sor"+i).bgColor = "white";
					document.getElementById("funk"+i).style.backgroundColor = "";
					document.getElementById("azon"+i).style.backgroundColor = "";
					document.getElementById("tipus"+i).style.backgroundColor = "";
				}
			}
		}
		document.getElementById("sor"+adatSzerk.sorokSzama).bgColor = "white";
		document.getElementById("funk"+adatSzerk.sorokSzama).style.backgroundColor = "";
		document.getElementById("azon"+adatSzerk.sorokSzama).style.backgroundColor = "";
		document.getElementById("tipus"+adatSzerk.sorokSzama).style.backgroundColor = "";
		
	  document.getElementById("adatszerkCim").style.backgroundImage = "none";	
	},
	
	/* sor vizsgálata, hogy az összes eleme üres-e */ 
	sorUres: function(sorId){
	  if (typeof(document.getElementById("funk"+sorId)) == "undefined"){
		  return true;
		}else{
		  if (document.getElementById("funk"+sorId).value.trim()=="" &&
			    document.getElementById("azon"+sorId).value.trim()=="" &&
					document.getElementById("tipus"+sorId).selectedIndex == 0 &&
					document.getElementById("checkI"+sorId).checked == false &&
					document.getElementById("checkO"+sorId).checked == false &&
					document.getElementById("checkM"+sorId).checked == false)
					{return true;}
			else{
		    return false;
			}
		}
	},
	
	/* sor vizsgálata, hogy van-e hiányzó elem */ 
	sorHianyos: function(sorId){
		if (document.getElementById("funk"+sorId).value.trim()=="" ||
			  document.getElementById("azon"+sorId).value.trim()=="" ||
				document.getElementById("tipus"+sorId).selectedIndex == 0 ||
				(document.getElementById("checkI"+sorId).checked == false &&
				document.getElementById("checkO"+sorId).checked == false &&
				document.getElementById("checkM"+sorId).checked == false)) return true;
		  
		return false;
	},
	
	/* sor másolása adott sor helyére */ 
	sorMasol: function(honnan, hova){
	  document.getElementById("funk"+hova).value = document.getElementById("funk"+honnan).value;
		document.getElementById("azon"+hova).value = document.getElementById("azon"+honnan).value;
		document.getElementById("tipus"+hova).selectedIndex = document.getElementById("tipus"+honnan).selectedIndex;
		document.getElementById("checkI"+hova).checked = document.getElementById("checkI"+honnan).checked;
		document.getElementById("checkO"+hova).checked = document.getElementById("checkO"+honnan).checked;
		document.getElementById("checkM"+hova).checked = document.getElementById("checkM"+honnan).checked;
	},
	
	/* sor törlése */ 
	sorTorol: function(sorId){
	  var tabla = document.getElementById("adatSzerkTabla");
		//alert(sorId);
		tabla.deleteRow(sorId+2);
		if (typeof(adatSzerk.sorok[sorId]) != "undefined") adatSzerk.sorok[sorId] = null;
	},
	
	/* sor elemeinek alapértékre, üresre állítása */ 
	sorUrit: function(sorId){
	  document.getElementById("funk"+sorId).value = "";
		document.getElementById("azon"+sorId).value = "";
		document.getElementById("tipus"+sorId).selectedIndex = 0;
		document.getElementById("checkI"+sorId).checked = false;
		document.getElementById("checkO"+sorId).checked = false;
		document.getElementById("checkM"+sorId).checked = false;
	}	 
}

codeBox = {

  sorSzam:1,
	
  scrolling: function(textarea){

		document.getElementById("codeRowIds").scrollLeft = 0;
		document.getElementById("codeRowIds").scrollTop = textarea.scrollTop;
		document.getElementById("codeRowIds").style.color = "#000000";
		
		codeBox.sorSzamNovel();
		document.getElementById("codeCode").style.backgroundPosition = 2-(document.getElementById("codeCode").scrollLeft%16)+"px 0px";
		
	},
	
	sorSzamNovel: function(){
	  var meddig = Math.floor((document.getElementById("codeCode").scrollHeight-2)/16);
	  if ( meddig> codeBox.sorSzam-1 || meddig<10){
		   //document.getElementById("footer").innerHTML += " "+meddig;
			 var lepes = 17;
			 for (var i=codeBox.sorSzam+1; i<=codeBox.sorSzam+lepes; i++){
			   document.getElementById("codeRowIds").value += i+".\n";
			 }
			 codeBox.sorSzam=codeBox.sorSzam+lepes;
		}
	},
	
	codeUrit: function(){
	  document.getElementById("codeRowIds").value = "1.\n";
		document.getElementById("codeCode").value = "";
		document.getElementById("codeCode").value = "I <- 8\nJ <- I+10\n\nIf (I+1)*2 < J and I < 9\n  Ki: 1\nElse\n  Ki: 0";
	}
}