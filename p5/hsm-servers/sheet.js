function Sheet() {
  
  var table;
  
  var sheet = this;
  
  sheet.week_count = 0;
  sheet.cust_count = 0;

  sheet.customers = {};

  var names_row_index = 0;
  var data_row_index = 1;
  
  var date_col_index  = 0;
  var year_col_index  = 1;
  var month_col_index = 2;
  var data_col_index  = 3; 
  
  var trailer_col_count = 2;
  
  var total_col_index = 0;
  var grand_col_index = 0;
  
  this.load = function(filename) {
    
    print(filename);
    table = loadTable(filename, "csv", function(){
      var row_count = table.getRowCount();
      var col_count = table.getColumnCount();
      console.log(filename, row_count, col_count);
    //   sheet.week_count = row_count - data_row_index; 
    //   sheet.cust_count = col_count - data_col_index - trailer_col_count;
    //   total_col_index = data_col_index + sheet.cust_count;
    //   grand_col_index = total_col_index + 1;
    //   console.log("weeks length ="+sheet.week_count);
    //   print("cust count ="+sheet.cust_count);
      
    //   // create an associative array of cust indices
    //   for( var col=0; col<sheet.cust_count; col++ ){
    //     customer_index = col+data_col_index;
    //     name = trim(table.getString(names_row_index,customer_index));
    //     sheet.customers[name] = col;
    //     // print some names for debugging
    //     if( col < 5 ) print(col+": "+name+": "+sheet.customers[name]);
    //   }
    });
      
  };
  
  this.get_index = function(customer_name){
    return(sheet.customers[customer_name]);
  }
  this.get_year = function(week){
    return this.get_num(week,year_col_index);
  }
  this.get_month = function(week){
    return this.get_num(week,month_col_index);
  }
  this.get_total = function(week){
    return this.get_num(week,total_col_index);
  }
  this.get_grand = function(week){
    return this.get_num(week,grand_col_index);
  }
  this.get_rank = function(week,cust_index){
    var rank = 0;
    var val = this.get_value(week,cust_index);
    for( var i=0; i<sheet.cust_count; i++){
      if( this.get_value(week,i) > val ) rank++;
    }
    return rank;
  }
  this.get_value = function(week,param){
    var index = param; // by default assume we get a number, but ...
    if( (typeof param)=="string" ) index = this.get_index(param);
    else index = param + data_col_index;
    //print("*** "+week+" : "+cust_index+" : "+data_col_index);
    var result = this.get_num(week,index);
    //print("*** result = "+result);
    return result;
  }
  this.get_value_by_name = function(week,customer_name){
    var ndx = this.get_index(customer_name);
    ///print("get value bu name. week = "+week+" : "+ndx);
    return this.get_value(week,ndx);
  }

  this.get_num = function(week,index){
    //print("get num week="+week+" index="+index);
    var result = table.getNum(week+data_row_index,index);
    //print(" get num result = "+result);
    return result;
  }

  var grand_max = 0;
  this.get_grand_max = function(){
    if( grand_max <= 0 ){
      for( var i=0; i<this.week_count; i++ ){
        grand_max = max(grand_max,this.get_grand(i));
      }
    }
    return grand_max;
  }
  
  var count_max = 0;
  this.get_value_max = function(){
    var x = sheet.week_count;
    print(" x = "+x);
    if( count_max <= 0 ){
      for( var i=0; i<sheet.week_count; i++ ){
        for( var j=0; j<sheet.cust_count; j++ ){
          //print(i+","+j+": "+this.get_value(i,j)+"  max="+count_max+" type ="+(typeof this.get_value(i,j)));
          count_max = Math.max(count_max,this.get_value(i,j));
          //print("after");
        }
        //print("after inner");

      }
      //print("after outer");
    }
    //print("returning "+count_max);

    return count_max;
  }

  this.show = function(max){
    print("*** show "+table.getColumnCount());
    for (var c=0; c<table.getColumnCount() && c<max; c++) {
      print(table.getString(0, c));
    }
  }

  this.dump = function(max) {
    //cycle through the table
    for (var r = 0; r < table.getRowCount() && r<max; r++){
      for (var c = 0; c < table.getColumnCount() && c<max; c++) {
        print(table.getString(r, c));
      }
    }
  }
  
};