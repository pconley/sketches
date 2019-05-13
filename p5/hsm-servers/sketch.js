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

const process_speed = 20; 
const movement_speed = 10; 
// var loop_rate = 15;
// var start_week = 0; //100; // 0;

function draw() {
  console.log("draw", frameCount);

  process_server_file(frameCount/process_speed)

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
ADD_HSM = "add_hsm"

const process_server_file = (timeCounter) => {
  // read all the unread rows for time less or equal now
  while( next_row_time(server_table) <= timeCounter ){
    server_row_index += 1
    const action = trim(server_table.getString(server_row_index,ACTION_COLUMN_INDEX));
    const server_name = trim(server_table.getString(server_row_index,NAME_COLUMN_INDEX));
    if( action == ADD_DROPLET ){
      const color = trim(server_table.getString(server_row_index,3));
      console.log(timeCounter, "read: ", action, server_name, color);
      servers[server_name] = new Server(name, color);
    } 
    if( action == ADD_HSM ){
      const hsm_name = trim(server_table.getString(server_row_index,3));
      const hsm_color = trim(server_table.getString(server_row_index,4));
      console.log(timeCounter, "read: ", action, server_name, hsm_name, hsm_color);
      server = servers[server_name];
      server.add_hsm(new Hsm(hsm_color))
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

const static_data = () => {

  const r = new Hsm(RED)
  const g = new Hsm(GREEN)
  const b = new Hsm(BLUE)

  const s1 = new Server("10.10.100.1");
  s1.add_hsm(r);
  s1.add_hsm(g);
  s1.add_hsm(b);
  const s2 = new Server("10.10.100.2");
  s2.add_hsm(g);
  s2.add_hsm(g);
  const s3 = new Server("10.10.200.99");
  s3.add_hsm(g);
  s3.add_hsm(b);
  s3.add_hsm(g);
  s3.add_hsm(r);

  const newstate = [s1,s2,s3]

  return newstate
}

