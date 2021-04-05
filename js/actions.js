$(document).ready(function () {
  let URLS = [];

  let types = {mp4: 'video/mp4', webm: 'video/webm', m3u: 'application/x-mpegURL'};
  let korbitPoster = 'https://uploads-ssl.webflow.com/5f5a8e39776b172b9dba4850/5f613fed928921ecfde8151b_logo.png';
  let videoList = [{
    sources: [{
      src: 'https://d2iqxzev1kjxgn.cloudfront.net/Why_Learn_Linear_Algebra/Why_Learn_Linear_Algebra.m3u8',
      type: types.m3u
    }],
    poster: korbitPoster , name: 'Why Learn Linear Algebra',
  }];
  let mySidebar = document.getElementById("mySidebar");

  function w3_open() {
    if (mySidebar.style.display === 'block') {
      mySidebar.style.display = 'none';
    } else {
      mySidebar.style.display = 'block';
    }
  }

  function w3_close() {
    mySidebar.style.display = "none";
  }
  videojs('video').ready(function () {
    let myPlayer = this;
    myPlayer.qualityPickerPlugin();
    myPlayer.playlist(videoList);
    myPlayer.playlistUi();

    let button = videojs.getComponent('Button');

    $("#up").change(function (event) {
      let uploadedFile = event.target.files[0];
      if (uploadedFile.type !== "text/javascript" && uploadedFile.type !== "application/x-javascript" && uploadedFile.type !== "application/json") {
        alert("Wrong file type == " + uploadedFile.type);
        return false;
      }
      if (uploadedFile) {
        let readFile = new FileReader();
        readFile.onload = function (e) {
          let contents = e.target.result;
          let json = JSON.parse(contents);
          videoList = [];
          for (let i = 0; i < json.length; i++) {
            let obj = json[i];
            let str = obj.split('/').reverse()[1];
            let res = str.replace(/_/g, " ");
            videoList.push( {
              sources: [{
                src: obj,
                type: types.m3u
              }],
              poster: korbitPoster , name: res,
            });

            let nClass = 'checking';
            var checkUrl = new XMLHttpRequest(), testUrl = obj;
            checkUrl.open('get', testUrl, true);
            checkUrl.onreadystatechange = checkReadyState;
            function checkReadyState() {
              if (checkUrl.readyState === 4) {
                nClass = 'responded';
                if (checkUrl.status > 400) {
                  nClass = 'timeout';
                }
                if(URLS.indexOf(obj) === -1){
                  URLS.push(obj);
                  $("#ping-test-result").append('<li class="li-'+nClass+'"><a href="'+obj+'">'+res+' : <span class="'+nClass+'">'+nClass+'</span></a></li>');
                }
              }
            }
            checkUrl.send(null);
            testAllURL();
          }
          let position = myPlayer.playlist.currentItem();
          myPlayer.playlist(videoList, position);
          // console.table(videoList);
          let updatedplaylist = myPlayer.playlist();
        };
        readFile.readAsText(uploadedFile);
      } else {
        console.log("Failed to load file");
      }
    });
    let closeButton = videojs.extend(button, {
      constructor: function () {
        button.apply(this, arguments);
        this.controlText("Exit Course");
        this.addClass('vjs-icon-cancel');
      },
      handleClick: function () {
        this.player().dispose();
      }
    });
    videojs.registerComponent('closeButton', closeButton);
    myPlayer.getChild('controlBar').addChild('closeButton', {});

    let PrevButton = videojs.extend(button, {
      constructor: function () {
        button.apply(this, arguments);
        this.addClass('icon-angle-left');
        this.controlText("Previous");
      },

      handleClick: function () {
        console.log('clickedPrevious');
        myPlayer.playlist.previous();
      }
    });

    videojs.registerComponent('PrevButton', PrevButton);
    myPlayer.getChild('controlBar').addChild('PrevButton', {}, 0);

    let NextButton = videojs.extend(button, {
      constructor: function () {
        button.apply(this, arguments);
        this.addClass('icon-angle-right');
        this.controlText("Next");
      },

      handleClick: function () {
        console.log('clickednext');
        myPlayer.playlist.next();
      }
    });

    videojs.registerComponent('NextButton', NextButton);

    myPlayer.getChild('controlBar').addChild('NextButton', {}, 2);

  });


  function testAllURL() {
    $("#ping-test-result > .li-checking").each(function (e) {
      let nClass = 'checking';
      let that = this;
      var checkUrl = new XMLHttpRequest(), testUrl = $(that).find('a').attr('href');
      checkUrl.open('get', testUrl, true);
      checkUrl.onreadystatechange = checkReadyState;
      function checkReadyState() {
        if (checkUrl.readyState === 4) {
          nClass = 'responded';
          if (checkUrl.status > 400) {
            nClass = 'timeout';
          }
          if(nClass != 'checking') {
            $(that).removeClass('li-checking');
            $(that).find('checking').removeClass('checking').addClass(nClass).text(nClass);
          } else {
            $(that).removeClass('li-checking');
            $(that).find('checking').removeClass('checking').addClass('timeout').text('request timeout');
          }
        }
      }
      checkUrl.send(null);
    });
  }
});