var commit_venue = true;

var poster_id = -1
var venue_id = -1
var num_of_artists=0;
var available_artist_ids=[];
var video_numb;
var cl;

function get_this_date(){

var fullDate = new Date();

//convert month to 2 digits

var twoDigitMonth=fullDate.getMonth()+1;

var currentDate = fullDate.getDate()+ "-" + twoDigitMonth + "-" + fullDate.getFullYear() ;

//Date field is empty
$("#id_on_date").attr("placeholder",currentDate);

}

/*

function handleFileSelect(evt) {
	 $("#poster").css("-webkit-background-size","100%" );
	   $("#poster").css("background-size:","cover" );
	var file_name="";
    var files = evt.target.files; // FileList object 
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
	  
           $("#poster").css("background-image","url("+e.target.result+")");
           
           file_name=theFile.name;
           
           //$(".image #image_url").val(file_name);
        };      
      })(f);
      // Read in the image file as a data URL.
      reader.readAsDataURL(f); 
    }
}
*/

Array.prototype.remove = function(from, to) {
  if(this.length==0)
	{return}
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

$(document).ready(function() {

	//$("#poster").css("background-image","url(/static/icons/overlay.png)");
	
	var date = $( ".datepicker" ).datepicker({
    	defaultDate: "+1w",
	changeMonth: true,
	numberOfMonths: 1,
	//dateFormat: "yy-mm-dd",
	dateFormat: "dd-mm-yy"
  });


 $("#artist_autocomplete").live('keydown', function(event){ 
    if (event.which == '13') {
    	event.preventDefault();
    	console.log("'heyyy");
        $('#add_another_artist_submit').trigger('click');
    }
	});


$("#artist_autocomplete").click(function(){
	this.value='';
    });
/*
the functions below are required for CSRF protection
*/
	jQuery(document).ajaxSend(function(event, xhr, settings) {
		  function getCookie(name) {

		      var cookieValue = null;
		      if (document.cookie && document.cookie != '') {
		          var cookies = document.cookie.split(';');
		          for (var i = 0; i < cookies.length; i++) {
		              var cookie = jQuery.trim(cookies[i]);
		              // Does this cookie string begin with the name we want?
		              if (cookie.substring(0, name.length + 1) == (name + '=')) {
		                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                  break;
		              }
		          }
		      }
		      return cookieValue;
		  }

		  function sameOrigin(url) {
		      // url could be relative or scheme relative or absolute
		      var host = document.location.host; // host + port
		      var protocol = document.location.protocol;
		      var sr_origin = '//' + host;
		      var origin = protocol + sr_origin;
		      // Allow absolute or scheme relative URLs to same origin
		      return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		          (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		          // or any other URL that isn't scheme relative or absolute i.e relative.
		          !(/^(\/\/|http:|https:).*/.test(url));
		  }

		  function safeMethod(method) {
		      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		  }

		  if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
		      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		  }
	});


//remove an artist
$(".remove_artist_row").live("click", function() { 
	
	available_artist_ids.push($(this).parent().parent().parent().attr("id"));
	//artist_ids.splice($(this).parent().attr('id'),1);
	$(this).parent().parent().parent().remove();
	num_of_artists--;
	console.log(available_artist_ids);
	
})

//open or close artist box
$(".edit_artist_row").live("click", function() { 
	$(this).parent().parent().parent().find(".add_event_artist_box").toggleClass("close").toggleClass("open");

	if($(this).parent().parent().parent().find(".add_event_artist_box").hasClass("open"))
	{
		$(this).html("Close");
		console.log("its open");
		$(this).parent().parent().parent().find(".add_event_artist_row").css("border-bottom","dashed 1px");
	}
	else if($(this).parent().parent().parent().find(".add_event_artist_box").hasClass("close"))
	{
		$(this).html("Edit");
		console.log("its close");
		$(this).parent().parent().parent().find(".add_event_artist_row").css("border-bottom","none");
	}
	
})


//add image for an artist
$("#add_image_url").live("click", function(){

	var artist_id=$(this).parent().parent().parent().attr('id');
	var img_url=$(".artists_field#"+artist_id+" .add_event_artist_box  .add_event_row input").val();
	console.log(artist_id,img_url );

	for(j=1; j<=6; j++)
	{
		if($(".artists_field#"+artist_id +" .add_ev_art_img_content .add_ev_art_img"+j).hasClass("empty"))
		{
			if(j==1)
			{
				$(".artists_field#"+artist_id+" .add_event_row .artist_image").css("background-image","url("+img_url+")");
			}
			$(".artists_field#"+artist_id +" .add_ev_art_img_content .add_ev_art_img"+j +" .image_number").css("display","none");
			$(".artists_field#"+artist_id +" .add_ev_art_img_content .add_ev_art_img"+j).append("<div id='remove_add_ev_art_img'></div>");
			$(".artists_field#"+artist_id +" .add_ev_art_img_content .add_ev_art_img"+j).css("background-image","url("+img_url+")");
			$(".artists_field#"+artist_id +" .add_ev_art_img_content .add_ev_art_img"+j).removeClass("empty");
			return;
		}
	}
	
});

//add video url for an artist (o arithmos tou video <div id='add_ev_art_vid1'> den einai swstos) 

$("#add_video_url").live("click", function(){


	var artist_id=$(this).parent().parent().parent().attr('id');
	parts=$(this).prev().val().split('?v=');
	console.log(parts[0]);

	for(j=1; j<=4; j++)
	{
		if($(".artists_field#"+artist_id +" .add_ev_art_vid_content .add_ev_art_vid"+j).hasClass("empty"))
		{
			$(".artists_field#"+artist_id+" .add_ev_art_vid_content .add_ev_art_vid"+j).html("<iframe  width:'296' height:'200' src='http://www.youtube.com/embed/"+parts[1]+"?wmode=opaque ' frameborder='0' allowfullscreen></iframe><div id='remove_add_ev_art_vid'></div>");
		
			
			$(".artists_field#"+artist_id +" .add_ev_art_vid_content .add_ev_art_vid"+j).removeClass("empty");
			return;
		}
	}
	/*
	video_numb++;
	if (video_numb<=4)
	{

		
		parts=$(this).prev().val().split('?v=');
		console.log(parts[0]);
		$(this).parent().next().append("<div class='add_ev_art_vid"+video_numb+"'>"+
		"<iframe  width:'227' height:'125' src='http://www.youtube.com/embed/"+parts[1]+"' frameborder='0' allowfullscreen></iframe><div id='remove_add_ev_art_vid'></div></div>");
		

	}
	else
	{
		video_numb--;
	}
	console.log("num of videos",video_numb);
	*/
	
});


$("#remove_add_ev_art_img").live("click", function(){
	$(this).parent().css("background-image","none");
	$(this).parent().addClass("empty");
	$(this).prev().css("display","block");
	$(this).css("display","none");

});

$("#remove_add_ev_art_vid").live("click", function(){
	$(this).prev().remove();
	$(this).parent().append("<div class='video_number'>"+$(this).parent().attr("class")[14]+"</div>")
	$(this).parent().addClass("empty");

	$(this).css("display","none");
	//video_numb--;
	//console.log("num of videos",video_numb);

});




$('#fileupload').fileupload({
    /* ... */
    /*progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .bar').css(
            'width',
            progress + '%'
        );
    },*/
    datatype:"json",
    add: function (e, data) {
         //console.log("add", data)
         data.submit()
    },
    done: function (e, data) {
        //console.log("done", data)
        data_result = JSON.parse(data.result)[0];
        $("#add_event_poster_url").attr("src","/static/posters/" + data_result.name );
        $("img#add_event_poster_url").load(function () {
		$("#form_add_poster").css("margin-top","-"+$(this).height()/2+"px");
		$("#fileupload").css("margin-top","-"+$(this).height()+"px");
		$("#fileupload").css("height",$(this).height())
		  console.log($(this).height());
		  });
        
        /*$("#poster").css("-webkit-background-size","100%" );
	$("#poster").css("background-size:","100%" );
	$("#poster").css("background-image","url(/static/posters/" + data_result.name + ")" );*/
        // add poster's id in a hidden field as a foreign key
        
        poster_id = data_result.id;
        $("#text #message").remove();
        if(poster_id!=-1)
		{	
			$("#form_add_poster").addClass("with_poster");
			$("#poster").mouseenter(function(){
		      $("#form_add_poster").removeClass("with_poster");
		    }).mouseleave(function(){
		    	$("#form_add_poster").addClass("with_poster");
		      
		    });
		}
		
    },
    fail: function (jqXHR, textStatus, errorThrown) 
    	{
            
            $("#text").append("<div id='message'>Too large file</div>")
        }
    
    	
    
});


	get_this_date();

//an o xrhsths dialeksei kallitexnh apo thn lista tou emfanizw ta pedia simfwna me auta pou uparxoun sthn bd
$( "#artist_autocomplete" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "/event/events/ajax/list/artist/",
				dataType: "jsonp",
				data: {
					name_startsWith: request.term
					},
				success: function( data ) {
					response( $.map( data, function( item ) {
					return {
						label: item.fields.name,
						value: item.fields.name,
						obj: item
						}
					}));
				}
			});
		},
		minLength: 2,
		select: function( event, ui ) {

			console.log("ARTIST DATA FROM SERVER",ui.item.obj);
			var artistid=show_artist_fields();
			console.log(artistid);
			populate_artist_fields_from_db(artistid, ui.item.obj)

			},
		open: function() {
			//$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			},
		close: function() {
			
			//$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			}
	});


//problhma ston loader
//gia na emfanizetai thn katalhlh stigmh mporw na xrhsimopoihsw tis ajaxStart k ajaxStop 
//alla mperdeuetai me ta calls pou kanei ston server to autocomplete kai emfanizetai sunexws
$("#add_another_artist_submit").click(function(){
	

	
	$(document).ajaxStart(function() {
		 delay(function(){
		 	$("#add_another_artist_submit").addClass("loading");
		}, 250);
   		
 	});
 	$(document).ajaxStop(function() {
 		delay(function(){
		 	$("#add_another_artist_submit").removeClass("loading");
		}, 250);
      
	});

	name = $("#artist_autocomplete").val();
	
	if (name.length > 0 && name.length < 100){

		
		var artistid=show_artist_fields();
		populate_artist_fields_from_lastfm(artistid, name);
	}
	
	$("#artist_autocomplete").val('');
    
	
});




$( "#venue_autocomplete" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "/event/events/ajax/list/venue/",
				dataType: "jsonp",
				data: {
					name_startsWith: request.term
					},
				success: function( data ) {
	
			            items = $.map( data, function( item ) {
										return {
											label: item.fields.name +", "+ item.fields.city,
											value: item.fields.name+", "+item.fields.city,
											obj: item
											}
								})
						items.push({label: "Add venue", value: "Add venue", obj:{}})
						response(items)
						$("a.ui-corner-all").last().css("color","red");
					}
			});
		},
		minLength: 2,
		select: function( event, ui ) {
			console.log(ui.item.obj,ui.item.label);
			if(ui.item.label=="Add venue")
			{
				commit_venue=true;
				$("#venue_form").show();
				$(".add_event_row.venue_fields").hide();
				$( "#venue_autocomplete" ).hide();
  

			}
			else
			{
				commit_venue=false;
				venue_id = ui.item.obj.pk;
				console.log(venue_id);
				log_venue( ui.item.obj);
			}
			
			
			
			},
		open: function() {
			//$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			},
		close: function() {
			//$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			}
		});

/*
$( "#venue_autocomplete" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "/event/events/ajax/list/venue/",
				dataType: "jsonp",
				data: {
					name_startsWith: request.term
					},
				success: function( data ) {
                   			if(data.length == 0){
                    				$("#venue_form").show();
                    				$(".add_event_row.venue_fields").css("display", "none");

//on select city put the value in the field
						$("select").change(function () {
						  var str = "";
						  $("select option:selected").each(function () {
							str += $(this).text() + " ";
						      });
						  $("#id_city").val(str);
						})
						.trigger('change');

						commit_venue = true;
                   			}
                   			else{
						response( $.map( data, function( item ) {
							
                        				return {
								label: item.fields.name +", "+ item.fields.city,
								value: item.fields.name+", "+item.fields.city,
								obj: item
								}
							}));
					}
                                     
				}
			});
		},
		minLength: 2,
		select: function( event, ui ) {
			commit_venue = false;
			log_venue( ui.item.obj);
			},
		open: function() {
			//$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			},
		close: function() {
			//$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			}
		});

*/
        $("#save_event").click(function(){
        
        $("#artist_autocomplete").removeClass("missing_field");
        $("#id_on_date").removeClass("missing_field");
        $("#venue_autocomplete").removeClass("missing_field");
        $("#form_add_poster").removeClass("missing_field");
		name = $("#venue_autocomplete").val();
  		console.log($(".artists_field").attr("id"),name,poster_id ,$("#id_on_date").val());
  		var time=$("#id_time").val();
  		var isValidTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
		if ( !isValidTime || $(".artists_field").length  == 0 || $("#id_on_date").val().length==0 || name.length == 0 ||  poster_id == -1){
			
			$("#message").html("please add missing info ");

			if($(".artists_field").length  == 0)
			{
				$( "#add_event_exp" ).scrollTop( 600 );
				$("#artist_autocomplete").addClass("missing_field");
				console.log("artist missing");
			}
			else if( $("#id_on_date").val().length==0 )
			{
				console.log("date missing");
				$( "#add_event_exp" ).scrollTop( 0 );
				$("#id_on_date").addClass("missing_field");
			}
			else if( name.length == 0)
			{
				console.log("venue missing");
				$( "#add_event_exp" ).scrollTop( 525 );
				$("#venue_autocomplete").addClass("missing_field");
			}
			else if(poster_id == -1)
			{
				console.log("poster missing");
				$( "#add_event_exp" ).scrollTop( 0 );
				$("#form_add_poster").addClass("missing_field");
			}
			else if(!isValidTime)
			{
				console.log("time format wrong");
				$( "#add_event_exp" ).scrollTop( 200 );
				$("#id_time").addClass("missing_field");
			}

			return;
		}
  		else{

  			
  			name = $("#id_name").val();
            if (name.length > 0 && name.length < 255 && commit_venue == true)
            {
            	console.log("mphka edw");
			$.ajax({
				url: "/venue/",
                        	type: "POST",
				dataType: "json",
				data: {name: name,info:' info missing',country:'Greece',
				url:$("#id_url").val(),city:$("select option:selected").val(),
				capacity:parseInt($("#id_capacity").val()) || 0,address:$("#id_address").val(),
				phone:''},
				success: function( data ) {
					if(data.success == true){
						console.log("successfully added venue")
                        venue_id = data.pk;
                        save_artists_data();
                        /*var artists_ids=save_artists_data();
                        console.log(artists_ids);
                        save_event(artists_ids);
                        */
						
					}
                    else 
                    	{
                    		$("#message").html("something bad happened in save venue ");
                    		console.log("something bad happened");
                    	}
                    		
				}
					
			});
           	}
			else 
			{
				console.log("mphka edw");
				save_artists_data();
				/*var artists_ids=save_artists_data();
                save_event(artists_ids);
				*/
			}
		}

	});

});



function show_artist_fields()
{
var artistID;
	
	


var src="";

if (available_artist_ids.length===0)
{
	artistID=num_of_artists;
	
}
else
{
	
	artistID=available_artist_ids[available_artist_ids.length-1];
	available_artist_ids.remove(parseInt(available_artist_ids.length-1));
}




//close all the open boxes
$(".add_event_artist_box").each(function () {
	
	
	
	console.log("its close");
	$(this).prev().css("border-bottom","none");
	$(this).removeClass("open");
	$(this).addClass("close");
	$(this).prev().find(".edit_artist_row").html("Edit");
	
	
});

$( "<div class='artists_field' id="+artistID+"/>" ).appendTo("#artist_results");

$(".artists_field#"+artistID).append("<div class='add_event_artist_box open'><div class='add_event_row'><label for='add_event_artist_bio'>Artist Bio:</label><div contenteditable='true' id='add_event_artist_bio' class='field'></div></div>"+
		"<div class='add_event_row'><label for='artist_image_url'>Artist Images:</label><span class='help_text'>Upload up to six images.</br> Remove an existing image to replace it.</span><input id='artist_image_url' class='field' placeholder='image url'></input><button id='add_image_url'>Upload image</button></div>"+
		"<div class='add_ev_art_img_content'><div id='' class='empty add_ev_art_img1'><div class='image_number'>1</div></div>"+
		"<div id='' class='empty add_ev_art_img2'><div class='image_number'>2</div></div>"+
		"<div id='' class='empty add_ev_art_img3'><div class='image_number'>3</div></div>"+
		"<div id='' class='empty add_ev_art_img4'><div class='image_number'>4</div></div>"+
		"<div id='' class='empty add_ev_art_img5'><div class='image_number'>5</div></div>"+
		"<div id='' class='empty add_ev_art_img6'><div class='image_number'>6</div></div></div>"+
		"<div class='add_event_row'><label for='artist_video_url'>Artist Videos:</label><span class='help_text'>Upload up to four videos.</br> Remove an existing video to replace it.</span><input id='artist_video_url' class='field' placeholder='youtube video url'></input><button id='add_video_url'>Upload video</button></div>"+
		"<div class='add_ev_art_vid_content'>"+
		"<div class='add_ev_art_vid1 empty'><div class='video_number'>1</div></div>"+
		"<div class='add_ev_art_vid2 empty'><div class='video_number'>2</div></div>"+
		"<div class='add_ev_art_vid3 empty'><div class='video_number'>3</div></div>"+
		"<div class='add_ev_art_vid4 empty'><div class='video_number'>4</div></div>"+
		"</div></div>");
$(".artists_field#"+artistID).prepend("<div class='add_event_artist_row'><div class='artist_image' '></div><div class=artist_name></div><div class='add_event_artist_buttoms'><button class='remove_artist_row'>Remove</button><button class='edit_artist_row'>Close</button></div><input type='hidden' value=''/></div></div>");

num_of_artists++;


return artistID;
	
}

//upothetw oti ola ta video pou uparxoun sthn bd exoun thn katalhksh ?wmode=opaque poy shmainei oti thn prosthetw eite 
//otan o xrhsths kanei upload ena kainourio video eite otan trabaw apo youtube
//edw tha kanw populate ta pedia tou kallitexnh me bash auta pou exw sthn bash
function populate_artist_fields_from_db(a_id, object)
{
	//by default if the artist exist the box is closed
	$(".artists_field#"+a_id +' .add_event_artist_box ').toggleClass("close").toggleClass("open");

	$(".artists_field#"+a_id +' .edit_artist_row').trigger('click');
	var artist_1=removePunctuation(object.fields.name);
	$(".artists_field#"+a_id +" .artist_name").html(artist_1);
	$(".artists_field#"+a_id+ " .add_event_row #add_event_artist_bio").html(object.fields.bio);

//populate images
	if(object.fields.images!=null)
	{
		var img_urls=object.fields.images.split("[");
		img_urls=img_urls[1].split("]");
		//var urls=object.fields.images.split(",");
		img_urls=img_urls[0].split(",");
		console.log("artists img_urls",img_urls.length);
		if(img_urls.length!=1)
		{
			$(".artists_field#"+a_id+" .add_event_artist_row .artist_image").css("background-image","url("+img_urls[0]+")");
			for(i=0; i<img_urls.length; i++)
			{
			console.log("images",i,img_urls[i]);
			$(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+(i+1)).prepend("<div id='remove_add_ev_art_img'></div>");
			$(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+(i+1)).css("background-image","url("+img_urls[i]+")");
			$(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+(i+1) +" .image_number").css("display","none");
			$(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+(i+1)).removeClass("empty");
	
			}
		}
	}
		
		
//populate videos
if(object.fields.videos!=null)
{
var vid_urls=object.fields.videos.split("[");

	vid_urls=vid_urls[1].split("]");
		//var urls=object.fields.images.split(",");
		vid_urls=vid_urls[0].split(",");
		console.log("artists vid_urls",vid_urls.length);
		if(vid_urls.length!=1)
		{
			for(j=0; j<vid_urls.length; j++)
		    {
		   		
		   	 console.log(vid_urls[j]);
		   	  var url=vid_urls[j].match(/"(.*?)"/);
		     // console.log(vid_urls[j],url[1]);

		      //url[1]=url[1]+"?wmode=opaque";
		      console.log(url[1]);
		      $(".artists_field#"+a_id+" .add_ev_art_vid_content .add_ev_art_vid"+(j+1)).removeClass("empty");
		      $(".artists_field#"+a_id+" .add_ev_art_vid_content .add_ev_art_vid"+(j+1)).html("<iframe  width:'296' height:'200' src='"+url[1]+"' frameborder='0' allowfullscreen></iframe><div id='remove_add_ev_art_vid'></div>");
		      //$(".artists_field#"+id_of_artist+" .add_ev_art_vid_content #add_ev_art_vid"+j+" .thumb_video").oembed("http://www.youtube.com/v/BhOO7F6K4Uo?version=3&f=videos&app=youtube_gdata");                        
		    }
		}
}
		


	
}


function populate_artist_fields_from_lastfm(a_id, name)
{

var artist_1=removePunctuation(name);
	
$(".artists_field#"+a_id +" .artist_name").html(artist_1);
$.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+
        name+"&api_key=75904470b83768ccf1292302837281c3&format=json",
        dataType: 'json',
        async: false,
        success: function(jsonLastfm){
        console.log(jsonLastfm);
        if(jsonLastfm.error!=6)
        {
            //$(".artists_field#"+a_id +" .artist_image").css("background-image","url("+jsonLastfm.artist.image[1]["#text"]+")");
		    $(".artists_field#"+a_id+ " .add_event_row #add_event_artist_bio").html(jsonLastfm.artist.bio.summary);

		}
                
		else
        {
            $(".artists_field#"+a_id+" .add_event_artist_box").prepend("<div class='user_info add_event_row'>No data found in last.fm </br> Complete some data for your poster</div>");     	
        }             
        }
});
			var img_numb=1;


		      var url = 'http://developer.echonest.com/api/v4/artist/images';

			    var args = { 
			            format:'json', 
			            api_key: 'GXJENKSQWMRLALLDE',
			            name: name.replace(" ", "+"),
			            results: 6
			    }; 

			   
			    $.getJSON(url, args,
			            function(data) {
			            	console.log(data);
			                
			                if (! ('images' in data.response)) {
			                    console.log("Can't find any images for " + name);
			                } else {
			                	$(".artists_field#"+a_id +" .artist_image").css("background-image","url("+data.response.images[0].url+")");
			                	 $.each(data.response.images, function(index,elem){
							        $(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+img_numb).prepend("<div id='remove_add_ev_art_img'></div>");
							        $(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+img_numb).css("background-image","url("+elem.url+")");
							        $(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+img_numb +" .image_number").css("display","none");
							        $(".artists_field#"+a_id+" .add_ev_art_img_content .add_ev_art_img"+img_numb).removeClass("empty");
							        img_numb++;
							        if(img_numb==6)
							            {
											return;
							            }
							     	});
			                }
			            },
			            function() {
			                error("Trouble getting blog posts for " + artist);
			            }
			        );

//populate data from youtube
video_numb=0;
$.getJSON("http://gdata.youtube.com/feeds/api/videos?max-results=4&alt=json&q="+
	name+"&format=5&category=Music", function(data){

    
    var entries = data.feed.entry || [];
    var parts;
    var usefull;
    for(j=0; j<entries.length; j++)
    {
      video_numb++;
      parts=entries[j].media$group.media$content[0].url.split('/v/');
      usefull=parts[1].split('?version');
      
      $(".artists_field#"+a_id+" .add_ev_art_vid_content .add_ev_art_vid"+video_numb).removeClass("empty");
      $(".artists_field#"+a_id+" .add_ev_art_vid_content .add_ev_art_vid"+video_numb).html("<iframe  width:'296' height:'200' src='http://www.youtube.com/embed/"+usefull[0]+"?wmode=opaque' frameborder='0' allowfullscreen></iframe><div id='remove_add_ev_art_vid'></div>");
      //$(".artists_field#"+id_of_artist+" .add_ev_art_vid_content #add_ev_art_vid"+j+" .thumb_video").oembed("http://www.youtube.com/v/BhOO7F6K4Uo?version=3&f=videos&app=youtube_gdata");                        
    }
    });


}


function fetchImages(artist) {

			 var url = 'http://developer.echonest.com/api/v4/artist/images';

			    var args = { 
			            format:'json', 
			            api_key: 'GXJENKSQWMRLALLDE',
			            name: artist,
			            results: 6, 
			            async: false
			    }; 

			   
			    $.getJSON(url, args,
			            function(data) {
			                
			                if (! ('images' in data.response)) {
			                    console.log("Can't find any images for " + artist);
			                } else {
			                	console.log(data);
			                    return(data);
			                }
			            },
			            function() {
			                error("Trouble getting blog posts for " + artist);
			            }
			        );

			
			}


function log_venue( venue ) {
  console.log(venue, venue.fields.address,venue.fields.city,venue.fields.url)
  venue_id = venue.pk;
  $("#venue_info .add_event_row #add_ev_venue_address").html(venue.fields.address);
  $("#venue_info .add_event_row #add_ev_venue_url").html(venue.fields.url);
  $("#venue_info .add_event_row #add_ev_venue_city").html(venue.fields.city);

  $(".add_event_row.venue_fields").css("display", "block");
  $("#venue_info #venue_form").css("display", "none");
  
  //$("#venue_form #id_country").val(venue.fields.country)
  //$("#venue_form #id_city").val(venue.fields.city)
  //$("#venue_form #id_phone").val(venue.fields.phone)
  //$("#venue_form #id_capacity").val(venue.fields.capacity)
  //$("#venue_form #id_address").val(venue.fields.address)
  //$("#venue_form #id_url").val(venue.fields.url)

  //$("#venue_form").show();
	
}

function save_event(artists_ids){

//price upoxrewtiko pedio gia to add event
	console.log(artists_ids.length);
	if(artists_ids.length === 0)
	{ 
		$("#message").html("please add missing info ");
		return;
	}
	var price=$("#id_price").val();
	var time=$("#id_time").val();
	var artist_ids;
	if(price=="")
	{
		price="0";
	}
	if(time=="")
	{
		time="21:00";
	}
	else
	{
		if(time.indexOf(":")<=0)
		{
			time=time+":00";
		}
	}
	var date=$("#id_on_date").val();
	var description=$("#id_description").val();
	

	console.log(date+" "+time,price,artists_ids,venue_id,poster_id.toString(), description );
	
	$.ajax({
		url: "/event/",
        	type: "POST",
		dataType: "json",
		data: {
			date:date+" "+time,
			price:price,
			artist_ids:JSON.stringify(artists_ids),
			venue_id:venue_id.toString(),
			poster_id:poster_id.toString(),
			description:description },
			success: function( data ) {
				if(data.success == true) 
				{
					console.log("successfully added event");
					$("#message").html("event successfully added");
					//_gaq.push(['_trackEvent', 'Event', 'Add']);
					ga('send', 'event', 'Event', 'Add');
					location.reload();
				}
            	else 
				{
					console.log("something bad happened in save event");
					$("#message").html("something bad happened in save event</br>Maybe the event already exists!");
				}			
			}
	});
	
  	return false;

}


function save_artists_data()
{
	var art_id;
	var art_ids=[];
	var art_name;
	var art_bio;
	var art_img;
	var art_vid;
	var url;
var amount=$($(".artists_field")).length;
	$(".artists_field").each(function(){

		art_img=[];
		art_vid=[];

		
		art_id=$(this).attr("id");
		art_name=$(".artists_field#"+art_id+" .add_event_artist_row .artist_name").html();
		art_bio=$(".artists_field#"+art_id+" .add_event_artist_box .add_event_row div").html();
		/*for(j=1; j<=6; j++)
		{
			if($(".artists_field#"+art_id+" .add_event_artist_box .add_ev_art_img_content .add_ev_art_img"+j).hasClass("empty") )
			{
				
			}
			else
			{
				
				console.log($(this).css("background-image"));
				url=$(this).css("background-image");
				url = url.replace('url(','').replace(')','');
				art_img.push(url);
			}
		}
		*/
		$(".artists_field#"+art_id+" .add_event_artist_box .add_ev_art_img_content div").each(function(){

			
			if($(this).hasClass("empty") || $(this).attr("id")=="remove_add_ev_art_img" || $(this).attr("class")=="image_number")
			{
				
			}
			else
			{
				
				
				url=$(this).css("background-image");
				url = url.replace('url(','').replace(')','');
				art_img.push(url);
			}
		});



		$(".artists_field#"+art_id+" .add_event_artist_box .add_ev_art_vid_content div").each(function(){

			
			if($(this).hasClass("empty") || $(this).attr("id")=="remove_add_ev_art_vid" || $(this).attr("class")=="video_number")
			{
				
			}
			else
			{
				
				
				url=$(this).children().attr("src");
				url = url.replace('url(','').replace(')','');
				art_vid.push(url);
			}
		});


		console.log($(this).attr("id"));
		console.log(art_name);
		console.log(art_vid);
		console.log(art_img);
		$.ajax({
			url: "/artist/",
			type: "POST",
			dataType: "json",
			data: {name: art_name, bio: art_bio, images: JSON.stringify(art_img), videos: JSON.stringify(art_vid)},
//artist fields : name, bio, images("url,url,..."), videos ("url,url,...")
//epistrefei ola ta pedia apothikeuei h ananewnei thn eggrafh tou artist
// GET /artist?query=blablabla epistrefei mono ta pedia name,bio,images,videos
			success: function( data ) {

				console.log(amount,art_ids.length);
				art_ids.push(data.pk);
				if(amount == art_ids.length)
				{
					console.log(amount,art_ids.length );
					console.log("artist ids from save artist data", art_ids);
					save_event(art_ids);
				}
				
			}
		
		});
		

	});

/*
	delay(function(){
		console.log(art_ids);
	  save_event(art_ids);

	  }, 500);
	*/
	
	
}
