/*
 * AST - Absztakt Szintakszis Fa
 *       Abstact Syntax Tree
 *
 * @author Edem
 * @version 1.0
 */

 /* A szintaktika által meghatározott elemek
    minden elem tartalmazza a formai követelményeit
	valamint gépikód megfelelőjét
	ezen metódusok hívásával történik majd a szintaktikai
	és szemantikai elemzés és a fordítás */
 
AST = {
 
 /* osztály a fa elemihez */
  node: function(name){
	  this.name = name;
	}
	
}