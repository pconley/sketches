var server_table;
var server_row_index = 0;

function preload() {
  set_global_colors();
  console.log("preload");
  server_table = load_table("servers"); 
  // no code here; the table is loaded async
}

servers = {};

function setup() {
  console.log("setup")
  frameRate(60);
  createCanvas(900,600); // w,h

  //servers = static_data(); 

  // var footer = height/5;
  // const graph_params = {top: 60, left: 10, height: height-footer, width:width-10-10}

  // noLoop(); // Run once and stop
}

// const process_speed = 10; 
const movement_speed = 10; 
// var loop_rate = 15;
// var start_week = 0; //100; // 0;

function draw() {
  if( frameCount%10 == 0 ) console.log("draw", frameCount);

  process_server_file(frameCount)

  background(BLACK); // clears canvas

  push(); // save draw state

  const distance_between_server_left = 120

  var server_num = 0;
  for (var name in servers) {
    offset = frameCount / movement_speed
    server = servers[name]
    // using framecount to move servers down and over
    const top = offset+10;
    const left = distance_between_server_left*server_num+offset;
    server.draw(left, top);
    server_num += 1
  }

  pop(); // restore draw state

  // stop after a number of iterations
  if( frameCount > 600 ) noLoop();
}

TIME_COLUMN_INDEX = 0
ACTION_COLUMN_INDEX = 1
NAME_COLUMN_INDEX = 2

ADD_DROPLET = "add_droplet"
DELETE_HSM = "del_hsm"
ADD_HSM = "add_hsm"

const process_server_file = (timeCounter) => {
  // read all the unread rows for time less or equal now
  while( (n=next_row_time(server_table)) <= timeCounter ){
    server_row_index += 1
    const action = trim(server_table.getString(server_row_index,ACTION_COLUMN_INDEX));
    const server_name = trim(server_table.getString(server_row_index,NAME_COLUMN_INDEX));
    if( action == ADD_DROPLET ){
      const color = trim(server_table.getString(server_row_index,3));
      console.log(timeCounter, "read: ", action, server_name, color);
      servers[server_name] = new Server(server_name, color);
    } 
    if( action == ADD_HSM ){
      const hsm_name = trim(server_table.getString(server_row_index,3));
      const hsm_color = trim(server_table.getString(server_row_index,4));
      console.log(timeCounter, "read: ", action, server_name, hsm_name, hsm_color);
      server = servers[server_name];
      server.add_hsm(new Hsm(n,hsm_name,hsm_color))
    } 
    if( action == DELETE_HSM ){
      const server = servers[server_name]; // TODO: what if error
      const hsm_name = trim(server_table.getString(server_row_index,3));
      console.log(timeCounter, "read: ", action, server_name, hsm_name);
      const found = server.hsms.findIndex(hsm => hsm.name == hsm_name);
      server.hsms.splice(found,1);
    } 
  }
}

const next_row_time = (table) => {
  // all our tables have
  const data_row_count = server_table.getRowCount()-1; // less header
  if( server_row_index >= data_row_count ) return 9999999999; // max time
  // otherwise return the time on the next row to be read
  return trim(server_table.getString(server_row_index+1,TIME_COLUMN_INDEX));
}

const load_table = (filename) => {
  const table =  loadTable("assets/"+filename+".csv", "csv", function () {
      var row_count = table.getRowCount();
      var col_count = table.getColumnCount();
      console.log(filename, "table loaded", row_count, col_count);
  });
  return table
};
