(function(){

    var app = angular.module('MultiJustRaceControllers', ["ngStorage" , 'ckeditor', 'ui.bootstrap' , 'naif.base64',  'MultiJustRaceControllers', 'MultiJustRaceDirectives' ]);


    app.controller('mainController', ['$scope', '$http', '$log', '$sessionStorage','$location', function($scope, $http, $log, $sessionStorage, $location){

        var competitionsFilter =[];
        $scope.competitions = [];
        $scope.diffDate =[];


        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=&name=&place=&wieloetapowe=1')
            .success(function(data){
            competitionsFilter = data;

            var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
            var counter = 0;

            for(var i=0; i<competitionsFilter.length; i++)
            {
                var today = new Date();
                var compDate = new Date(competitionsFilter[i].DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                var compTime = competitionsFilter[i].CZAS_ROZP.split(":");
                compDate.setHours(compTime[0]);
                compDate.setMinutes(compTime[1]);

                if(today <= compDate)
                {
                    $scope.competitions.push(competitionsFilter[i]);
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    compDate.setHours(0);
                    compDate.setMinutes(0);
                    compDate.setSeconds(0);
                    compDate.setMilliseconds(0);
                    $scope.competitions[counter].DIFF = Math.floor((compDate - today) / (1000*60*60*24))
                    counter++;
                }

                if(counter>7)
                    break;
            }

            })
            .error(function(data,status,headers,config){
            $scope.retInfo = 'Błąd!'+ data;
            })


            $scope.showCompetitionDetails = function(id, data, godzina) {
                        	sessionStorage.setItem('compID', id);
                        	sessionStorage.setItem('compData', data);
                        	sessionStorage.setItem('compGodzina', godzina);
                        	$location.path('/Multi/home/competition');
                        };
    }])


    app.controller('logoutController', ['$scope', '$sessionStorage','$location', function($scope, $sessionStorage, $location){

    	$scope.imie = sessionStorage.getItem('IMIE');

        $scope.logoutClick = function(){
            //sessionStorage.removeItem('MultiJustRace');

        	sessionStorage.removeItem('IMIE');
            sessionStorage.removeItem('ICE');
            sessionStorage.removeItem('ACTIVATE');
            sessionStorage.removeItem('OBYWATELSTWO');
            sessionStorage.removeItem('NR_TEL');
            sessionStorage.removeItem('NAZWISKO');
            sessionStorage.removeItem('ID');
            sessionStorage.removeItem('EMAIL');
            sessionStorage.removeItem('KLUB');
            sessionStorage.removeItem('CODE');
            sessionStorage.removeItem('PLEC');
            sessionStorage.removeItem('WIEK');

            window.location = '/Multi/index.html';
        };

        $scope.init = function() {
             //window.location = 'Multi/home/main.html';
             $location.path('/Multi/home/main');

        }

    }])

    app.controller('profileController', ['$scope', '$http', '$sessionStorage', '$location', function($scope, $http, $sessionStorage, $location){
        $scope.btnText = 'Rozwiń';
        $scope.btnType = 'btn btn-success';
        $scope.check = 1;

        $scope.user = [];

        //$scope.user = sessionStorage.getItem('MultiJustRace');

        $scope.user.IMIE = sessionStorage.getItem('IMIE');
        $scope.user.ICE = sessionStorage.getItem('ICE');
        $scope.user.ACTIVATE = sessionStorage.getItem('ACTIVATE');
        $scope.user.OBYWATELSTWO = sessionStorage.getItem('OBYWATELSTWO');
        $scope.user.NR_TEL = sessionStorage.getItem('NR_TEL');
        $scope.user.NAZWISKO = sessionStorage.getItem('NAZWISKO');
        $scope.user.ID = sessionStorage.getItem('ID');
        $scope.user.EMAIL = sessionStorage.getItem('EMAIL');
        $scope.user.KLUB = sessionStorage.getItem('KLUB');
        $scope.user.CODE = sessionStorage.getItem('CODE');
        $scope.user.PLEC = sessionStorage.getItem('PLEC');
        $scope.user.WIEK = sessionStorage.getItem('WIEK');

        if(sessionStorage.getItem('msg') != null){
        	$scope.msg = sessionStorage.getItem('msg');
        	sessionStorage.removeItem('msg');
        }

        $scope.print = function() {
            if( $scope.check == 1 ) {
                $scope.btnText = 'Zwiń';
                $scope.btnType = 'btn btn-danger';
                $scope.check = 0;
            }

            else {
                $scope.btnText = 'Rozwiń';
                $scope.btnType = 'btn btn-success';
                $scope.check = 1;
            }
        };

        $scope.edit = function() {
            $location.path('/Multi/home/editProfile');
        };
    }])

    app.controller('editProfileController', ['$scope', '$http', '$sessionStorage', '$location','$log', function($scope, $http, $sessionStorage, $location, $log){
                  $scope.user = {
                      name : null,
                      surname : null,
                      email : null,
    				  age : null,
                      password : null,
                      old_password : null,
                      delete_password : null,
                      club : null,
                      obywatelstwo : null,
                      nr_tel : null,
                      ice : null
                  };

			    	$scope.user.name = sessionStorage.getItem('IMIE');
			        $scope.user.ice = sessionStorage.getItem('ICE');

                    if($scope.user.ice == "null")
                        $scope.user.ice = "";
			        $scope.user.obywatelstwo = sessionStorage.getItem('OBYWATELSTWO');
                    if($scope.user.obywatelstwo == "null")
                        $scope.user.obywatelstwo = "";
			        $scope.user.nr_tel = sessionStorage.getItem('NR_TEL');
                    if($scope.user.nr_tel=="null")
                        $scope.user.nr_tel="";
			        $scope.user.surname = sessionStorage.getItem('NAZWISKO');
			        $scope.user.email = sessionStorage.getItem('EMAIL');
			        $scope.user.club = sessionStorage.getItem('KLUB');
                    if($scope.user.club == "null")
                        $scope.user.club="";
			        $scope.user.age = parseInt( sessionStorage.getItem('WIEK') );

    				$scope.changePasswordClick = function(){
    					var id = sessionStorage.getItem('ID');

    					$http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/user/password?user_id='+ id +
    							'&old_password=' + $scope.user.old_password +
    							'&new_password=' + $scope.user.password)

    							.success(function(data){
    								$scope.retInfo = data;

    								if(data.content == 'Wrong password'){
    									sessionStorage.setItem('msg', 'Zmiana nie powiodła się z powodu podania złego hasła');
    								}

    								else{
    									sessionStorage.setItem('msg', 'Zmiana hasła powiodła się.');
    								}

    								$location.path('/Multi/home/profile');
    							})
    							.error(function(data,status,headers,config){
    								$scope.retInfo = 'Błąd!'+ data;

    							})
    				};


                  $scope.editProfileClick = function(){
                      var id = sessionStorage.getItem('ID');

                      $http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/user?name=' + $scope.user.name +
                    		  											'&surname=' + $scope.user.surname +
                    		  											'&email=' + $scope.user.email +
                    		  											'&user_id=' + id +
                    		  											'&age=' + $scope.user.age +
                    		  											'&club=' + $scope.user.club +
                    		  											'&nr_tel=' + $scope.user.nr_tel +
                    		  											'&ICE=' + $scope.user.ice +
                    		  											'&nationality=' + $scope.user.obywatelstwo)

                          .success(function (data, status, headers) {
                        	  $scope.retInfo2 = data;
                        	  sessionStorage.setItem('msg', 'Edycja danych powiodła się.');

                        	  sessionStorage.setItem('IMIE', $scope.user.name);
                              sessionStorage.setItem('ICE', $scope.user.ice);
                              sessionStorage.setItem('OBYWATELSTWO', $scope.user.obywatelstwo);
                              sessionStorage.setItem('NR_TEL', $scope.user.nr_tel);
                              sessionStorage.setItem('NAZWISKO', $scope.user.surname);
                              sessionStorage.setItem('EMAIL', $scope.user.email);
                              sessionStorage.setItem('KLUB', $scope.user.club);
                              sessionStorage.setItem('WIEK', $scope.user.age);

                        	  $location.path('/Multi/home/profile');
                          })
                          .error(function (data, status, header, config) {
                              $scope.retInfo2 ='Błąd!' + data;
                          });
                  };

                  $scope.deleteAccountClick = function(){
                	  var id = sessionStorage.getItem('ID');

                	  $http.delete('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/user/delete?user_id=' + id +
                			  																'&password=' + $scope.user.delete_password)

						.success(function (data, status, headers) {
							if(data.content == 'Wrong password'){
								sessionStorage.setItem('msg', 'Usunięcie konta nie powiodło się z powodu podania złego hasła');
								$location.path('/Multi/home/profile');
							}

							else{
								$scope.retInfo2 = data;

								sessionStorage.removeItem('IMIE');
					            sessionStorage.removeItem('ICE');
					            sessionStorage.removeItem('ACTIVATE');
					            sessionStorage.removeItem('OBYWATELSTWO');
					            sessionStorage.removeItem('NR_TEL');
					            sessionStorage.removeItem('NAZWISKO');
					            sessionStorage.removeItem('ID');
					            sessionStorage.removeItem('EMAIL');
					            sessionStorage.removeItem('KLUB');
					            sessionStorage.removeItem('CODE');
					            sessionStorage.removeItem('PLEC');
					            sessionStorage.removeItem('WIEK');

					            window.location = '/Multi/index.html';
							}
						})
						.error(function (data, status, header, config) {
							$scope.retInfo2 ='Błąd!' + data;
						});

                  };
    }])

    app.controller('competitionsController', ['$scope','$http', '$sessionStorage', '$location', '$route', '$log', function($scope, $http, $sessionStorage, $location, $route, $log){

    	$scope.search = 0;
    	$scope.btnText = 'Rozwiń filtry wyszukiwania';

        $scope.response = [];

        $scope.types = [
                        {name:'Bieg przełajowy' ,type:'Biegi'},
                        {name:'Bieg maratoński' ,type:'Biegi'},
                        {name:'Bieg uliczny' ,type:'Biegi'},
                        {name:'Bieg górski' ,type:'Biegi'},
                        {name:'Chód' ,type:'Biegi'},
                        {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                        {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                        {name:'Bieg narciarski' ,type:'Narciarskie'},
                        {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                        {name:'Wyścig samolotów' ,type:'Powietrzne'},
                        {name:'Wyścig balonów' ,type:'Powietrzne'},
                        {name:'Wyścig samochodowy' ,type:'Motorowe'},
                        {name:'Wyścig off-road' ,type:'Motorowe'},
                        {name:'Karting' ,type:'Motorowe'},
                        {name:'Wyścig motocykli' ,type:'Motorowe'},
                        {name:'Wyścig quadów' ,type:'Motorowe'},
                        {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                        {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Inne' ,type:'Inne'}
                        ];

        $scope.init = function() {
        	$scope.t = [{name: '', type: ''}];

        	$scope.spr = sessionStorage.getItem('hide');
        	var temp = sessionStorage.getItem('type_name');
        	$scope.t = sessionStorage.getItem('type');
            $scope.name = sessionStorage.getItem('name');
            $scope.place = sessionStorage.getItem('place');

            sessionStorage.removeItem('type');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('place');
        	sessionStorage.removeItem('hide');
        	sessionStorage.removeItem('type_name');

        	if($scope.spr != null)
        		$scope.print();

            if(!($scope.t == null) && !($scope.t == 'undefined')) {
            	for(i = 0; i < $scope.types.length; i++) {
            		if(temp == $scope.types[i].name) {
            			$scope.t = $scope.types[i];
            			break;
            		}
            	}
            }

            if(temp == null || temp == 'undefined')
            	temp = '';

            if($scope.name == null)
            	$scope.name = '';

            if($scope.place == null)
            	$scope.place = '';

        	$http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=' + temp +
					'&name=' + $scope.name +
					'&place=' + $scope.place +
                    '&wieloetapowe=0')
			.success(function(data){
			$scope.response = data;

            var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
            $scope.countFinded = $scope.response.length;
            $scope.countActive = 0;
            $scope.competitions = [];

            for(var i=0; i<$scope.response.length; i++)
            {

                var today = new Date();
                var compDate = new Date($scope.response[i].DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                var compTime = $scope.response[i].CZAS_ROZP.split(":");
                compDate.setHours(compTime[0]);
                compDate.setMinutes(compTime[1]);
                $scope.competitions.push($scope.response[i]);

                if(today <= compDate)
                {

                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    compDate.setHours(0);
                    compDate.setMinutes(0);
                    compDate.setSeconds(0);
                    compDate.setMilliseconds(0);
                    $scope.competitions[i].DIFF = Math.floor((compDate - today) / (1000*60*60*24));
                    $scope.countActive++;
                }
                else
                {
                    $scope.competitions[i].DIFF = -1;
                }
            }


            for(i = 0; i < $scope.response.length; i++) {
            	var miesiac = $scope.response[i].DATA_ROZP.substr(3, 2);
            	var rok = $scope.response[i].DATA_ROZP.substr(6, 4);

            	if(miesiac.charAt(0) == '0')
            		miesiac = miesiac.substr(1, 1);

            	$scope.response[i].MIESIAC = miesiac;
            	$scope.response[i].ROK = rok;
            }

            var year = new Date().getFullYear();

            var month = 1;

            var months = new Array(14);

            for(i = 0; i < 14; i++)
            	months[i] = 0;

            for(i = 0; i < $scope.response.length; i++) {
            	if(parseInt(year) > parseInt($scope.response[i].ROK))
            		months[0]++;

            	if(parseInt(year) == parseInt($scope.response[i].ROK))
            		months[parseInt($scope.response[i].MIESIAC)]++;

            	if(parseInt(year) < parseInt($scope.response[i].ROK))
            		months[13]++;
            }

            $scope.pages = new Array(14);

            for (var i = 0; i < 14; i++) {
            	$scope.pages[i] = new Array(months[i]);
            }

            var all = $scope.response;

            for(i = 0; i < 14; i++)
            	$scope.pages[i] = all.splice(0, months[i]);

            $scope.show = new Array(14);
            $scope.btn = new Array(14);
            $scope.style = new Array(14);

            for(i = 0; i < 14; i++) {
            	$scope.btn[i] = 'btn btn-primary';
            	$scope.style[i] = 'background-color: #222933;';
            }

            if($scope.spr == null) {
            	month = new Date().getMonth();
            	$scope.changePage(++month);
            }

            else
            	$scope.changePage(15);

			})

			.error(function(data,status,headers,config){
			$scope.retInfo = 'Błąd!'+ data;
			})
        };

        $scope.s = function() {
        	sessionStorage.setItem('type', $scope.t);

        	if($scope.t != null)
        		sessionStorage.setItem('type_name', $scope.t.name);

        	sessionStorage.setItem('name', $scope.name);
        	sessionStorage.setItem('place', $scope.place);
        	sessionStorage.setItem('hide', 1);

        	$route.reload();
        };

        $scope.w = function() {
        	$route.reload();
        };



            $scope.openPage = function(id, data, godzina) {
            	sessionStorage.setItem('compID', id);
            	sessionStorage.setItem('compData', data);
            	sessionStorage.setItem('compGodzina', godzina);

            	$location.path('/Multi/home/competition');
            };

            $scope.print = function() {
            	if( $scope.search == 1 ) {
            		$scope.btnText = 'Rozwiń filtry wyszukiwania';
                    $scope.search = 0;
            	}

            	else {
            		$scope.btnText = 'Zwiń filtry wyszukiwania';
                    $scope.search = 1;
            	}

            };

            $scope.changePage = function(nr) {
            	if(nr == 15) {
            		for(i = 0; i < 14; i++) {
                		$scope.show[i] = 1;
                		$scope.style[i] = 'background-color: white; color: black;';
            		}
            	}

            	else {
            		for(i = 0; i < 14; i++) {
                		$scope.show[i] = 0;
                		$scope.style[i] = 'background-color: white; color: black;';
            		}

                	$scope.show[nr] = 1;
                	$scope.style[nr] = 'background-color: #233859';
            	}
            };
    }])

    app.controller('myCompetitionsController', ['$scope','$http', '$sessionStorage', '$location', '$route', '$log', function($scope, $http, $sessionStorage, $location, $route, $log){

        $scope.search = 0;
        $scope.btnText = 'Rozwiń filtry wyszukiwania';
        sessionStorage.removeItem('name');
        $scope.response = [];

        $scope.types = [
                        {name:'Bieg przełajowy' ,type:'Biegi'},
                        {name:'Bieg maratoński' ,type:'Biegi'},
                        {name:'Bieg uliczny' ,type:'Biegi'},
                        {name:'Bieg górski' ,type:'Biegi'},
                        {name:'Chód' ,type:'Biegi'},
                        {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                        {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                        {name:'Bieg narciarski' ,type:'Narciarskie'},
                        {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                        {name:'Wyścig samolotów' ,type:'Powietrzne'},
                        {name:'Wyścig balonów' ,type:'Powietrzne'},
                        {name:'Wyścig samochodowy' ,type:'Motorowe'},
                        {name:'Wyścig off-road' ,type:'Motorowe'},
                        {name:'Karting' ,type:'Motorowe'},
                        {name:'Wyścig motocykli' ,type:'Motorowe'},
                        {name:'Wyścig quadów' ,type:'Motorowe'},
                        {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                        {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Inne' ,type:'Inne'}
                        ];



        $scope.init = function() {
            $scope.t = [{name: '', type: ''}];
            $scope.response=[];
            $scope.spr = sessionStorage.getItem('hide');
            var temp = sessionStorage.getItem('type_name');
            $scope.t = sessionStorage.getItem('type');
            $scope.name = sessionStorage.getItem('name');
            $scope.place = sessionStorage.getItem('place');

            sessionStorage.removeItem('type');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('place');
            sessionStorage.removeItem('hide');
            sessionStorage.removeItem('type_name');

            if($scope.spr != null)
                $scope.print();

            if(!($scope.t == null) && !($scope.t == 'undefined')) {
                for(i = 0; i < $scope.types.length; i++) {
                    if(temp == $scope.types[i].name) {
                        $scope.t = $scope.types[i];
                        break;
                    }
                }
            }

            if(temp == null || temp == 'undefined')
                temp = '';

            if($scope.name == null)
                $scope.name = '';

            if($scope.place == null)
                $scope.place = '';

            var user_id = sessionStorage.getItem('ID');

            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/my?user_id=' + user_id +
                    '&type=' + temp +
                    '&name=' + $scope.name +
                    '&place=' + $scope.place +
                    '&wieloetapowe=0')
            .success(function(data){
            $scope.response = data;

            var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
            $scope.countFinded = $scope.response.length;
            $scope.countActive = 0;
            $scope.competitions = [];

            for(var i=0; i<$scope.response.length; i++)
            {
                var today = new Date();
                var compDate = new Date($scope.response[i].DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                var compTime = $scope.response[i].CZAS_ROZP.split(":");
                compDate.setHours(compTime[0]);
                compDate.setMinutes(compTime[1]);
                $scope.competitions.push($scope.response[i]);
                $scope.dlugosc =  $scope.response[i].WIELOETAPOWE.length;
                if(today <= compDate)
                {

                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    compDate.setHours(0);
                    compDate.setMinutes(0);
                    compDate.setSeconds(0);
                    compDate.setMilliseconds(0);
                    $scope.competitions[i].DIFF = Math.floor((compDate - today) / (1000*60*60*24));
                    $scope.countActive++;
                }
                else
                {
                    $scope.competitions[i].DIFF = -1;
                }
            }


            for(i = 0; i < $scope.response.length; i++) {
                var miesiac = $scope.response[i].DATA_ROZP.substr(3, 2);
                var rok = $scope.response[i].DATA_ROZP.substr(6, 4);

                if(miesiac.charAt(0) == '0')
                    miesiac = miesiac.substr(1, 1);

                $scope.response[i].MIESIAC = miesiac;
                $scope.response[i].ROK = rok;
            }

            var year = new Date().getFullYear();

            var month = 1;

            var months = new Array(14);

            for(i = 0; i < 14; i++)
                months[i] = 0;

            for(i = 0; i < $scope.response.length; i++) {
                if(parseInt(year) > parseInt($scope.response[i].ROK))
                    months[0]++;

                if(parseInt(year) == parseInt($scope.response[i].ROK))
                    months[parseInt($scope.response[i].MIESIAC)]++;

                if(parseInt(year) < parseInt($scope.response[i].ROK))
                    months[13]++;
            }

            $scope.pages = new Array(14);

            for (var i = 0; i < 14; i++) {    ///////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Zamiana z i<14 na i<12 !!!!!!!!!!!
                $scope.pages[i] = new Array(months[i]);
            }

            var all = $scope.response;

            for(i = 0; i < 14; i++)
                $scope.pages[i] = all.splice(0, months[i]);

            $scope.show = new Array(14);
            $scope.btn = new Array(14);
            $scope.style = new Array(14);

            for(i = 0; i < 14; i++) {
                $scope.btn[i] = 'btn btn-primary';
                $scope.style[i] = 'background-color: #222933;';
            }

            if($scope.spr == null) {
                month = new Date().getMonth();
                $scope.changePage(++month);
            }

            else
                $scope.changePage(15);

            })

            .error(function(data,status,headers,config){
            $scope.retInfo = 'Błąd!'+ data;
            })
        };

        $scope.s = function() {
            sessionStorage.setItem('type', $scope.t);

            if($scope.t != null)
                sessionStorage.setItem('type_name', $scope.t.name);

            sessionStorage.setItem('name', $scope.name);
            sessionStorage.setItem('place', $scope.place);
            sessionStorage.setItem('hide', 1);

            $route.reload();
        };

        $scope.w = function() {
            $route.reload();
        };



            $scope.openPage = function(id, data, godzina) {
                sessionStorage.setItem('compID', id);
                sessionStorage.setItem('compData', data);
                sessionStorage.setItem('compGodzina', godzina);

                $location.path('/Multi/home/myCompetition');
            };

            $scope.print = function() {
                if( $scope.search == 1 ) {
                    $scope.btnText = 'Rozwiń filtry wyszukiwania';
                    $scope.search = 0;
                }

                else {
                    $scope.btnText = 'Zwiń filtry wyszukiwania';
                    $scope.search = 1;
                }

            };

            $scope.changePage = function(nr) {
                if(nr == 15) {
                    for(i = 0; i < 14; i++) {
                        $scope.show[i] = 1;
                        $scope.style[i] = 'background-color: white; color: black;';
                    }
                }

                else {
                	for(i = 0; i < 14; i++) {
                		$scope.show[i] = 0;
                		$scope.style[i] = 'background-color: white; color: black;';
            		}

                	$scope.show[nr] = 1;
                	$scope.style[nr] = 'background-color: #233859';
                }
            };
    }])

     app.controller('showStagesController', ['$scope','$http', '$sessionStorage', '$location', '$route', '$log', function($scope, $http, $sessionStorage, $location, $route, $log){

            $scope.search = 0;
            $scope.btnText = 'Rozwiń filtry wyszukiwania';
            $scope.compID = sessionStorage.getItem('compID1');
            $scope.response = [];
            sessionStorage.removeItem('NAME');
            $scope.types = [
                            {name:'Bieg przełajowy' ,type:'Biegi'},
                            {name:'Bieg maratoński' ,type:'Biegi'},
                            {name:'Bieg uliczny' ,type:'Biegi'},
                            {name:'Bieg górski' ,type:'Biegi'},
                            {name:'Chód' ,type:'Biegi'},
                            {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                            {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                            {name:'Bieg narciarski' ,type:'Narciarskie'},
                            {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                            {name:'Wyścig samolotów' ,type:'Powietrzne'},
                            {name:'Wyścig balonów' ,type:'Powietrzne'},
                            {name:'Wyścig samochodowy' ,type:'Motorowe'},
                            {name:'Wyścig off-road' ,type:'Motorowe'},
                            {name:'Karting' ,type:'Motorowe'},
                            {name:'Wyścig motocykli' ,type:'Motorowe'},
                            {name:'Wyścig quadów' ,type:'Motorowe'},
                            {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                            {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                            {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                            {name:'Inne' ,type:'Inne'}
                            ];



            $scope.init = function() {
                $scope.t = [{name: '', type: ''}];
                $scope.response=[];
                $scope.spr = sessionStorage.getItem('hide');
                var temp = sessionStorage.getItem('type_name');
                $scope.t = sessionStorage.getItem('type');
                $scope.name = sessionStorage.getItem('name');
                $scope.place = sessionStorage.getItem('place');

                sessionStorage.removeItem('type');
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('place');
                sessionStorage.removeItem('hide');
                sessionStorage.removeItem('type_name');

                if($scope.spr != null)
                    $scope.print();

                if(!($scope.t == null) && !($scope.t == 'undefined')) {
                    for(i = 0; i < $scope.types.length; i++) {
                        if(temp == $scope.types[i].name) {
                            $scope.t = $scope.types[i];
                            break;
                        }
                    }
                }

                if(temp == null || temp == 'undefined')
                    temp = '';

                if($scope.name == null)
                    $scope.name = '';

                if($scope.place == null)
                    $scope.place = '';

                var user_id = sessionStorage.getItem('ID');
                $scope.id = sessionStorage.getItem('compID');
                $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/my?user_id=' + user_id +
                        '&type=' + temp +
                        '&name=' + $scope.name +
                        '&place=' + $scope.place +
                        '&wieloetapowe=' + $scope.compID)
                .success(function(data){
                $scope.response = data;

                var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
                $scope.countFinded = $scope.response.length;
                $scope.countActive = 0;
                $scope.competitions = [];

                for(var i=0; i<$scope.response.length; i++)
                {
                    var today = new Date();
                    var compDate = new Date($scope.response[i].DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                    var compTime = $scope.response[i].CZAS_ROZP.split(":");
                    compDate.setHours(compTime[0]);
                    compDate.setMinutes(compTime[1]);
                    $scope.competitions.push($scope.response[i]);
                    $scope.dlugosc =  $scope.response[i].WIELOETAPOWE.length;
                    if(today <= compDate)
                    {

                        today.setHours(0);
                        today.setMinutes(0);
                        today.setSeconds(0);
                        today.setMilliseconds(0);
                        compDate.setHours(0);
                        compDate.setMinutes(0);
                        compDate.setSeconds(0);
                        compDate.setMilliseconds(0);
                        $scope.competitions[i].DIFF = Math.floor((compDate - today) / (1000*60*60*24));
                        $scope.countActive++;
                    }
                    else
                    {
                        $scope.competitions[i].DIFF = -1;
                    }
                }


                for(i = 0; i < $scope.response.length; i++) {
                    var miesiac = $scope.response[i].DATA_ROZP.substr(3, 2);
                    var rok = $scope.response[i].DATA_ROZP.substr(6, 4);

                    if(miesiac.charAt(0) == '0')
                        miesiac = miesiac.substr(1, 1);

                    $scope.response[i].MIESIAC = miesiac;
                    $scope.response[i].ROK = rok;
                }

                var year = new Date().getFullYear();

                var month = 1;

                var months = new Array(14);

                for(i = 0; i < 14; i++)
                    months[i] = 0;

                for(i = 0; i < $scope.response.length; i++) {
                    if(parseInt(year) > parseInt($scope.response[i].ROK))
                        months[0]++;

                    if(parseInt(year) == parseInt($scope.response[i].ROK))
                        months[parseInt($scope.response[i].MIESIAC)]++;

                    if(parseInt(year) < parseInt($scope.response[i].ROK))
                        months[13]++;
                }

                $scope.pages = new Array(14);

                for (var i = 0; i < 14; i++) {    ///////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Zamiana z i<14 na i<12 !!!!!!!!!!!
                    $scope.pages[i] = new Array(months[i]);
                }

                var all = $scope.response;

                for(i = 0; i < 14; i++)
                    $scope.pages[i] = all.splice(0, months[i]);

                $scope.show = new Array(14);
                $scope.btn = new Array(14);
                $scope.style = new Array(14);

                for(i = 0; i < 14; i++) {
                    $scope.btn[i] = 'btn btn-primary';
                    $scope.style[i] = 'background-color: #222933;';
                }

                if($scope.spr == null) {
                    month = new Date().getMonth();
                    $scope.changePage(++month);
                }

                else
                    $scope.changePage(15);

                })

                .error(function(data,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data;
                })
            };

            $scope.s = function() {
                sessionStorage.setItem('type', $scope.t);

                if($scope.t != null)
                    sessionStorage.setItem('type_name', $scope.t.name);

                sessionStorage.setItem('name', $scope.name);
                sessionStorage.setItem('place', $scope.place);
                sessionStorage.setItem('hide', 1);

                $route.reload();
            };

            $scope.w = function() {
                $route.reload();
            };



                $scope.openPage = function(id, data, godzina) {
                    sessionStorage.setItem('compID', id);
                    sessionStorage.setItem('compData', data);
                    sessionStorage.setItem('compGodzina', godzina);

                    $location.path('/Multi/home/myCompetition');
                };
                $scope.openPage1 = function(id, data, godzina) {
                    sessionStorage.setItem('compID', id);
                    sessionStorage.setItem('compData', data);
                    sessionStorage.setItem('compGodzina', godzina);

                    $location.path('/Multi/home/competition/stage');
                };
                $scope.print = function() {
                    if( $scope.search == 1 ) {
                        $scope.btnText = 'Rozwiń filtry wyszukiwania';
                        $scope.search = 0;
                    }

                    else {
                        $scope.btnText = 'Zwiń filtry wyszukiwania';
                        $scope.search = 1;
                    }

                };

                $scope.changePage = function(nr) {
                    if(nr == 15) {
                        for(i = 0; i < 14; i++) {
                            $scope.show[i] = 1;
                            $scope.style[i] = 'background-color: white; color: black;';
                        }
                    }

                    else {
                    	for(i = 0; i < 14; i++) {
                    		$scope.show[i] = 0;
                    		$scope.style[i] = 'background-color: white; color: black;';
                		}

                    	$scope.show[nr] = 1;
                    	$scope.style[nr] = 'background-color: #233859';
                    }
                };
        }])

    app.controller('runnerCompetitionsController', ['$scope','$http', '$sessionStorage', '$location', '$route', '$log', function($scope, $http, $sessionStorage, $location, $route, $log){

        $scope.search = 0;
        $scope.btnText = 'Rozwiń filtry wyszukiwania';

        $scope.response = [];

        $scope.types = [
                        {name:'Bieg przełajowy' ,type:'Biegi'},
                        {name:'Bieg maratoński' ,type:'Biegi'},
                        {name:'Bieg uliczny' ,type:'Biegi'},
                        {name:'Bieg górski' ,type:'Biegi'},
                        {name:'Chód' ,type:'Biegi'},
                        {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                        {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                        {name:'Bieg narciarski' ,type:'Narciarskie'},
                        {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                        {name:'Wyścig samolotów' ,type:'Powietrzne'},
                        {name:'Wyścig balonów' ,type:'Powietrzne'},
                        {name:'Wyścig samochodowy' ,type:'Motorowe'},
                        {name:'Wyścig off-road' ,type:'Motorowe'},
                        {name:'Karting' ,type:'Motorowe'},
                        {name:'Wyścig motocykli' ,type:'Motorowe'},
                        {name:'Wyścig quadów' ,type:'Motorowe'},
                        {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                        {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Inne' ,type:'Inne'}
                        ];



        $scope.init = function() {
            $scope.t = [{name: '', type: ''}];

            $scope.spr = sessionStorage.getItem('hide');
            var temp = sessionStorage.getItem('type_name');
            $scope.t = sessionStorage.getItem('type');
            $scope.name = sessionStorage.getItem('name');
            $scope.place = sessionStorage.getItem('place');

            sessionStorage.removeItem('type');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('place');
            sessionStorage.removeItem('hide');
            sessionStorage.removeItem('type_name');

            if($scope.spr != null)
                $scope.print();

            if(!($scope.t == null) && !($scope.t == 'undefined')) {
                for(i = 0; i < $scope.types.length; i++) {
                    if(temp == $scope.types[i].name) {
                        $scope.t = $scope.types[i];
                        break;
                    }
                }
            }

            if(temp == null || temp == 'undefined')
                temp = '';

            if($scope.name == null)
                $scope.name = '';

            if($scope.place == null)
                $scope.place = '';

            var user_id = sessionStorage.getItem('ID');

            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/user/list?user_id=' + user_id +
                    '&type=' + temp +
                    '&name=' + $scope.name +
                    '&place=' + $scope.place +
                    '&wieloetapowe=0')
            .success(function(data){
            $scope.response = data;

            $scope.response = data;

            var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
            $scope.countFinded = $scope.response.length;
            $scope.countActive = 0;
            $scope.competitions = [];

            for(var i=0; i<$scope.response.length; i++)
            {
                var today = new Date();
                var compDate = new Date($scope.response[i].DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                var compTime = $scope.response[i].CZAS_ROZP.split(":");
                compDate.setHours(compTime[0]);
                compDate.setMinutes(compTime[1]);
                $scope.competitions.push($scope.response[i]);

                if(today <= compDate)
                {

                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    compDate.setHours(0);
                    compDate.setMinutes(0);
                    compDate.setSeconds(0);
                    compDate.setMilliseconds(0);
                    $scope.competitions[i].DIFF = Math.floor((compDate - today) / (1000*60*60*24));
                    $scope.countActive++;
                }
                else
                {
                    $scope.competitions[i].DIFF = -1;
                }
            }

            for(i = 0; i < $scope.response.length; i++) {
                var miesiac = $scope.response[i].DATA_ROZP.substr(3, 2);
                var rok = $scope.response[i].DATA_ROZP.substr(6, 4);

                if(miesiac.charAt(0) == '0')
                    miesiac = miesiac.substr(1, 1);

                $scope.response[i].MIESIAC = miesiac;
                $scope.response[i].ROK = rok;
            }

            var year = new Date().getFullYear();

            var month = 1;

            var months = new Array(14);

            for(i = 0; i < 14; i++)
                months[i] = 0;

            for(i = 0; i < $scope.response.length; i++) {
                if(parseInt(year) > parseInt($scope.response[i].ROK))
                    months[0]++;

                if(parseInt(year) == parseInt($scope.response[i].ROK))
                    months[parseInt($scope.response[i].MIESIAC)]++;

                if(parseInt(year) < parseInt($scope.response[i].ROK))
                    months[13]++;
            }

            $scope.pages = new Array(14);

            for (var i = 0; i < 14; i++) {
                $scope.pages[i] = new Array(months[i]);
            }

            var all = $scope.response;

            for(i = 0; i < 14; i++)
            	$scope.pages[i] = all.splice(0, months[i]);

            $scope.show = new Array(14);
            $scope.btn = new Array(14);
            $scope.style = new Array(14);

            for(i = 0; i < 14; i++) {
                $scope.btn[i] = 'btn btn-primary';
                $scope.style[i] = 'background-color: #222933;';
            }

            if($scope.spr == null) {
                month = new Date().getMonth();
                $scope.changePage(++month);
            }

            else
                $scope.changePage(15);

            })

            .error(function(data,status,headers,config){
            $scope.retInfo = 'Błąd!'+ data;
            })
        };

        $scope.s = function() {
            sessionStorage.setItem('type', $scope.t);

            if($scope.t != null)
                sessionStorage.setItem('type_name', $scope.t.name);

            sessionStorage.setItem('name', $scope.name);
            sessionStorage.setItem('place', $scope.place);
            sessionStorage.setItem('hide', 1);

            $route.reload();
        };

        $scope.w = function() {
            $route.reload();
        };



            $scope.openPage = function(id, data, godzina) {
                sessionStorage.setItem('compID', id);
                sessionStorage.setItem('compData', data);
                sessionStorage.setItem('compGodzina', godzina);

                $location.path('/Multi/home/competition');
            };

            $scope.print = function() {
                if( $scope.search == 1 ) {
                    $scope.btnText = 'Rozwiń filtry wyszukiwania';
                    $scope.search = 0;
                }

                else {
                    $scope.btnText = 'Zwiń filtry wyszukiwania';
                    $scope.search = 1;
                }

            };

            $scope.changePage = function(nr) {
                if(nr == 15) {
                    for(i = 0; i < 14; i++) {
                        $scope.show[i] = 1;
                        $scope.style[i] = 'background-color: #222933;';
                    }
                }

                else {
                	for(i = 0; i < 14; i++) {
                		$scope.show[i] = 0;
                		$scope.style[i] = 'background-color: white; color: black;';
            		}

                	$scope.show[nr] = 1;
                	$scope.style[nr] = 'background-color: #233859';
                }
            };
    }])

    app.controller('competitionController', ['$scope','$http', '$location', '$sessionStorage', '$log', function($scope, $http, $location, $sessionStorage, $log){

    	$scope.check7 = 0;

    	// Editor options.
        $scope.options = {
          language: 'pl',
          allowedContent: true,
          entities: false
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {
        	CKEDITOR.instances['editor'].setReadOnly(true);

        	var temp = CKEDITOR.instances['editor'].id + "_top";

        	var bar = document.getElementById(temp);
            bar.style.display = "none";

            temp = CKEDITOR.instances['editor'].id + "_bottom";

            bar = document.getElementById(temp);
            bar.style.display = "none";
        }

    	$scope.competition = [];
        $scope.id = sessionStorage.getItem('compID');

            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=&name=&place=&wieloetapowe='+ $scope.id)
                        .success(function(data1){
                        $scope.competition1 = data1;

                        })
            .error(function(data,status,headers,config){
                            $scope.retInfo = 'Błąd!'+ data;
            });

            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + $scope.id)
            .success(function(data){
                $scope.competition = data;

                if(data.DEACTIVATED == 'true') {
                	$scope.check7 = 1;
                }

            })
            .error(function(data,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data;
            });
            //czy ma klasyfikacje
                        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+ $scope.id)
                                                    .success(function(data3){

                                                    $scope.class = data3;
                                                  })
                                     .error(function(data,status,headers,config){
                                                 $scope.retInfo = 'Błąd!'+ data;
                                    });
            $scope.showCompRunnersList = function(){
                sessionStorage.setItem('compID', $scope.id);
                sessionStorage.setItem('compName', $scope.competition.NAME);
                sessionStorage.setItem('compPay', $scope.competition.OPLATA);
                sessionStorage.setItem('stage', $scope.competition1.length);
                $location.path('/Multi/home/competition/compRunnersList');

            }

           $scope.showResultList = function(){
                sessionStorage.setItem('compID', $scope.id);
                sessionStorage.setItem('stage', $scope.competition1.length);
                $location.path('/Multi/home/competition/results');
            }
            $scope.showStage = function(){
                          sessionStorage.setItem('compID1', $scope.id);
                         $location.path('/Multi/home/competitions/stages');
                         }
              $scope.showRunnerStage = function(){
                    sessionStorage.setItem('compID1', $scope.id);
                     $location.path('/Multi/home/competitions/runnerStages');
              }


    }])


app.controller('showRunnerStagesController', ['$scope','$http', '$sessionStorage', '$location', '$route', '$log', function($scope, $http, $sessionStorage, $location, $route, $log){

            $scope.search = 0;
            $scope.btnText = 'Rozwiń filtry wyszukiwania';
            $scope.compID = sessionStorage.getItem('compID1');
            $scope.response = [];
            sessionStorage.removeItem('NAME');
            $scope.types = [
                            {name:'Bieg przełajowy' ,type:'Biegi'},
                            {name:'Bieg maratoński' ,type:'Biegi'},
                            {name:'Bieg uliczny' ,type:'Biegi'},
                            {name:'Bieg górski' ,type:'Biegi'},
                            {name:'Chód' ,type:'Biegi'},
                            {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                            {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                            {name:'Bieg narciarski' ,type:'Narciarskie'},
                            {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                            {name:'Wyścig samolotów' ,type:'Powietrzne'},
                            {name:'Wyścig balonów' ,type:'Powietrzne'},
                            {name:'Wyścig samochodowy' ,type:'Motorowe'},
                            {name:'Wyścig off-road' ,type:'Motorowe'},
                            {name:'Karting' ,type:'Motorowe'},
                            {name:'Wyścig motocykli' ,type:'Motorowe'},
                            {name:'Wyścig quadów' ,type:'Motorowe'},
                            {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                            {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                            {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                            {name:'Inne' ,type:'Inne'}
                            ];



            $scope.init = function() {
                $scope.t = [{name: '', type: ''}];
                $scope.response=[];
                $scope.spr = sessionStorage.getItem('hide');
                var temp = sessionStorage.getItem('type_name');
                $scope.t = sessionStorage.getItem('type');
                $scope.name = sessionStorage.getItem('name');
                $scope.place = sessionStorage.getItem('place');

                sessionStorage.removeItem('type');
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('place');
                sessionStorage.removeItem('hide');
                sessionStorage.removeItem('type_name');

                if($scope.spr != null)
                    $scope.print();

                if(!($scope.t == null) && !($scope.t == 'undefined')) {
                    for(i = 0; i < $scope.types.length; i++) {
                        if(temp == $scope.types[i].name) {
                            $scope.t = $scope.types[i];
                            break;
                        }
                    }
                }

                if(temp == null || temp == 'undefined')
                    temp = '';

                if($scope.name == null)
                    $scope.name = '';

                if($scope.place == null)
                    $scope.place = '';

                var user_id = sessionStorage.getItem('ID');
                $scope.id = sessionStorage.getItem('compID');
                $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=' + temp +
                        '&name=' + $scope.name +
                        '&place=' + $scope.place +
                        '&wieloetapowe=' + $scope.compID)
                .success(function(data){
                $scope.response = data;

                var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
                $scope.countFinded = $scope.response.length;
                $scope.countActive = 0;
                $scope.competitions = [];

                for(var i=0; i<$scope.response.length; i++)
                {
                    var today = new Date();
                    var compDate = new Date($scope.response[i].DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                    var compTime = $scope.response[i].CZAS_ROZP.split(":");
                    compDate.setHours(compTime[0]);
                    compDate.setMinutes(compTime[1]);
                    $scope.competitions.push($scope.response[i]);
                    $scope.dlugosc =  $scope.response[i].WIELOETAPOWE.length;
                    if(today <= compDate)
                    {

                        today.setHours(0);
                        today.setMinutes(0);
                        today.setSeconds(0);
                        today.setMilliseconds(0);
                        compDate.setHours(0);
                        compDate.setMinutes(0);
                        compDate.setSeconds(0);
                        compDate.setMilliseconds(0);
                        $scope.competitions[i].DIFF = Math.floor((compDate - today) / (1000*60*60*24));
                        $scope.countActive++;
                    }
                    else
                    {
                        $scope.competitions[i].DIFF = -1;
                    }
                }


                for(i = 0; i < $scope.response.length; i++) {
                    var miesiac = $scope.response[i].DATA_ROZP.substr(3, 2);
                    var rok = $scope.response[i].DATA_ROZP.substr(6, 4);

                    if(miesiac.charAt(0) == '0')
                        miesiac = miesiac.substr(1, 1);

                    $scope.response[i].MIESIAC = miesiac;
                    $scope.response[i].ROK = rok;
                }

                var year = new Date().getFullYear();

                var month = 1;

                var months = new Array(14);

                for(i = 0; i < 14; i++)
                    months[i] = 0;

                for(i = 0; i < $scope.response.length; i++) {
                    if(parseInt(year) > parseInt($scope.response[i].ROK))
                        months[0]++;

                    if(parseInt(year) == parseInt($scope.response[i].ROK))
                        months[parseInt($scope.response[i].MIESIAC)]++;

                    if(parseInt(year) < parseInt($scope.response[i].ROK))
                        months[13]++;
                }

                $scope.pages = new Array(14);

                for (var i = 0; i < 14; i++) {    ///////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Zamiana z i<14 na i<12 !!!!!!!!!!!
                    $scope.pages[i] = new Array(months[i]);
                }

                var all = $scope.response;

                for(i = 0; i < 14; i++)
                    $scope.pages[i] = all.splice(0, months[i]);

                $scope.show = new Array(14);
                $scope.btn = new Array(14);
                $scope.style = new Array(14);

                for(i = 0; i < 14; i++) {
                    $scope.btn[i] = 'btn btn-primary';
                    $scope.style[i] = 'background-color: #222933;';
                }

                if($scope.spr == null) {
                    month = new Date().getMonth();
                    $scope.changePage(++month);
                }

                else
                    $scope.changePage(15);

                })

                .error(function(data,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data;
                })
            };

            $scope.s = function() {
                sessionStorage.setItem('type', $scope.t);

                if($scope.t != null)
                    sessionStorage.setItem('type_name', $scope.t.name);

                sessionStorage.setItem('name', $scope.name);
                sessionStorage.setItem('place', $scope.place);
                sessionStorage.setItem('hide', 1);

                $route.reload();
            };

            $scope.w = function() {
                $route.reload();
            };



                $scope.openPage = function(id, data, godzina) {
                    sessionStorage.setItem('compID', id);
                    sessionStorage.setItem('compData', data);
                    sessionStorage.setItem('compGodzina', godzina);

                    $location.path('/Multi/home/myCompetition');
                };
                $scope.openPage1 = function(id, data, godzina) {
                    sessionStorage.setItem('compID', id);
                    sessionStorage.setItem('compData', data);
                    sessionStorage.setItem('compGodzina', godzina);

                    $location.path('/Multi/home/competition/stage');
                };
                $scope.print = function() {
                    if( $scope.search == 1 ) {
                        $scope.btnText = 'Rozwiń filtry wyszukiwania';
                        $scope.search = 0;
                    }

                    else {
                        $scope.btnText = 'Zwiń filtry wyszukiwania';
                        $scope.search = 1;
                    }

                };

                $scope.changePage = function(nr) {
                    if(nr == 15) {
                        for(i = 0; i < 14; i++) {
                            $scope.show[i] = 1;
                            $scope.style[i] = 'background-color: white; color: black;';
                        }
                    }

                    else {
                    	for(i = 0; i < 14; i++) {
                    		$scope.show[i] = 0;
                    		$scope.style[i] = 'background-color: white; color: black;';
                		}

                    	$scope.show[nr] = 1;
                    	$scope.style[nr] = 'background-color: #233859';
                    }
                };
        }])


    app.controller('myCompetitionController', ['$scope','$http', '$location', '$sessionStorage', '$log', function($scope, $http, $location, $sessionStorage, $log){

        // Editor options.
        $scope.options = {
          language: 'pl',
          allowedContent: true,
          entities: false
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {
            CKEDITOR.instances['editor'].setReadOnly(true);

            var temp = CKEDITOR.instances['editor'].id + "_top";

            var bar = document.getElementById(temp);
            bar.style.display = "none";

            temp = CKEDITOR.instances['editor'].id + "_bottom";

            bar = document.getElementById(temp);
            bar.style.display = "none";
        }

        $scope.competition = [];
        $scope.id = sessionStorage.getItem('compID');
        var id = sessionStorage.getItem('ID');

            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + $scope.id)
            .success(function(data){
                $scope.competition = data;

                if(data.DEACTIVATED == 'true') {
                	$scope.check7 = 1;
                }

                $scope.name = $scope.competition.NAME;
                var today = new Date();
                var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
                var compDate = new Date($scope.competition.DATA_ROZP.replace(datePattern, '$3, $2, $1'));
                var compTime = $scope.competition.CZAS_ROZP.split(":");
                compDate.setHours(compTime[0]);
                compDate.setMinutes(compTime[1]);
                if(today < compDate)
                {
                    $scope.editActive = true;
                    sessionStorage.setItem('editActive', $scope.editActive);
                }
                else
                {
                    $scope.editActive = false;
                    sessionStorage.setItem('editActive', $scope.editActive);
                }
            })
            .error(function(data,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data;
            });

            //czy ma etapy
            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=&name=&place=&wieloetapowe='+ $scope.id)
                        .success(function(data1){
                        $scope.competition1 = data1;

                        })
            .error(function(data,status,headers,config){
                            $scope.retInfo = 'Błąd!'+ data;
                        });

             //czy ma pkt pomiaru czasu
            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/route?competition_id='+ $scope.id)
                            .success(function(data2){
                          $scope.competition2 = data2;
                          })
             .error(function(data,status,headers,config){
                         $scope.retInfo = 'Błąd!'+ data;
            });

            //czy ma klasyfikacje
            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+ $scope.id)
                                        .success(function(data3){

                                        $scope.class = data3;
                                      })
                         .error(function(data,status,headers,config){
                                     $scope.retInfo = 'Błąd!'+ data;
                        });

            $scope.showRunnersList = function(){
            sessionStorage.setItem('compID', $scope.id);
            sessionStorage.setItem('compName', $scope.competition.NAME);
            sessionStorage.setItem('compPay', $scope.competition.OPLATA);
            sessionStorage.setItem('wielo', $scope.competition.WIELOETAPOWE);
            sessionStorage.setItem('stage', $scope.competition1.length);
            $location.path('/Multi/home/myCompetition/runnersList');

            }

            $scope.editCompetition = function(){
                sessionStorage.setItem('stage', $scope.competition1.length);
                sessionStorage.setItem('ilePKT', $scope.competition2.COUNT);
                $location.path('/Multi/home/myCompetition/edit');

            }
            $scope.makeStage = function(){
                   sessionStorage.setItem('name', $scope.name);
                   sessionStorage.setItem('stage', $scope.competition1.length);
                   $location.path('/Multi/home/myCompetition/stage');

             }
            $scope.showStage = function(){
              sessionStorage.setItem('compID1', $scope.id);
             $location.path('/Multi/home/myCompetitions/myStages');
             }

            $scope.dropCompetition = function(){
                $scope.check2 = 1;
            }

            $scope.dropCompetition2 = function(){


            	$http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/deactivate?user_id=' + id + '&competition_id=' + $scope.id + '&reason=' + $scope.reason)
                .success(function(data){
                	$scope.check2 = 0;

                	$scope.retInfo = 'Zawody odwołane! Użytkownicy zostali o tym poinformowani przez wiadomość email z powodem.';

                	$scope.check3 = 1;
                	$scope.check7 = 1;
                	$scope.reason = '';

                })

                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });
            }

            $scope.showResultList = function(){
                sessionStorage.setItem('compID', $scope.id);
                sessionStorage.setItem('name', $scope.name);
                sessionStorage.setItem('stage', $scope.competition1.length);
                $location.path('/Multi/home/myCompetition/results');
            }
            $scope.makeClassification = function(){
                sessionStorage.setItem('compID', $scope.id);
                sessionStorage.setItem('ID', id);
                sessionStorage.setItem('name', $scope.name);
                sessionStorage.setItem('stage', $scope.competition1.length);
                sessionStorage.setItem('ilePKT', $scope.competition2.COUNT);
                $location.path('/Multi/home/myCompetition/makeClassification');
            }
    }])


    app.controller('runnerCompetitionController', ['$scope','$http', '$location', '$sessionStorage', '$log', function($scope, $http, $location, $sessionStorage, $log){

    	// Editor options.
        $scope.options = {
          language: 'pl',
          allowedContent: true,
          entities: false
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {
        	CKEDITOR.instances['editor'].setReadOnly(true);

        	var temp = CKEDITOR.instances['editor'].id + "_top";

        	var bar = document.getElementById(temp);
            bar.style.display = "none";

            temp = CKEDITOR.instances['editor'].id + "_bottom";

            bar = document.getElementById(temp);
            bar.style.display = "none";
        }

    	$scope.btnText = 'Rozwiń';
        $scope.btnType = 'btn btn-success';
        $scope.check = 1;
        $scope.cat = '';

    	$scope.response = [];
        $scope.id = sessionStorage.getItem('compID');


            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + $scope.id)
            .success(function(data){
                $scope.response = data;

            })

            .error(function(data,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data;
            });

            $scope.print = function() {
                if( $scope.check == 1 ) {
                    $scope.btnText = 'Zwiń';
                    $scope.btnType = 'btn btn-danger';
                    $scope.check = 0;
                }

                else {
                    $scope.btnText = 'Rozwiń';
                    $scope.btnType = 'btn btn-success';
                    $scope.check = 1;
                }
            };


    }])

    app.controller('runnersListController', ['$scope','$http', '$route', '$sessionStorage', '$log', '$location', function($scope, $http, $route, $sessionStorage, $log, $location){


        var token = sessionStorage.getItem('ID');
        $scope.hasStage = sessionStorage.getItem('stage');
    	$scope.runners = [
    	                    {IMIE : ''},
    	                    {NAZWISKO : ''},
    	                    {COMPETITION_ID : ''},
    	                    {USER_ID: ''},
    	                    {OPLACONE: ''},
                            {EVENT_NR: 'brak'},
                            {CATEGORY: ''}
    	                    ];

    	$scope.plci = [{nazwa: 'kobieta'}, {nazwa: 'mężczyzna'}];
    	$scope.cat = [{NAME: ''}, {DESCRIPTION : ''}];
    	$scope.nazwaCat = '';
    	$scope.desc = '';
    	$scope.x = sessionStorage.getItem('wielo');
    	$scope.name = sessionStorage.getItem('compName');

    	var id = sessionStorage.getItem('compID');
    	$scope.competitionName = sessionStorage.getItem('compName');
        sessionStorage.removeItem('competitionName');
        $scope.compPay = sessionStorage.getItem('compPay');
        $scope.editActive = sessionStorage.getItem('editActive');



        $scope.addCat = function() {
    		$http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/category?user_id=' + token +
                    '&competition_id=' + id + '&name=' + $scope.nazwaCat + '&description=' + $scope.desc)
			.success(function(data){
				$scope.retInfo = 'Kategoria dodana';

				$scope.categories.push({NAME: $scope.nazwaCat});

				$scope.nazwaCat = '';
		    	$scope.desc = '';
			})

			.error(function(data,status,headers,config){
			$scope.retInfo = 'Błąd!'+ data;
			});
    	};

            $scope.init = function() {

            	$scope.init2();
            	  $scope.wieloetapowe = sessionStorage.getItem('WIELOETAPOWE');
                var sex = '';

                $scope.search = 0;
                $scope.check = 0;
            	$scope.btnText = 'Rozwiń filtry wyszukiwania';

                $scope.spr = sessionStorage.getItem('hide');
            	$scope.age = sessionStorage.getItem('age');
                $scope.sex = sessionStorage.getItem('sex');
                $scope.phrase = sessionStorage.getItem('phrase');
                $scope.cat.NAME = sessionStorage.getItem('category');

                sessionStorage.removeItem('hide');
                sessionStorage.removeItem('age');
                sessionStorage.removeItem('sex');
            	sessionStorage.removeItem('phrase');
            	sessionStorage.removeItem('category');

            	$scope.print = function() {
                	if( $scope.search == 1 ) {
                		$scope.btnText = 'Rozwiń filtry wyszukiwania';
                        $scope.search = 0;
                	}

                	else {
                		$scope.btnText = 'Zwiń filtry wyszukiwania';
                        $scope.search = 1;
                	}

                };


            	if($scope.spr != null)
            		$scope.print();

                if($scope.age == null)
                	$scope.age = '';

                if($scope.sex == null)
                	sex = '';

                	if($scope.phrase == null)
                    	$scope.phrase = '';

                    if($scope.cat.NAME == null)
                    	$scope.cat.NAME = '';

                	if($scope.sex == 'kobieta') {
                		sex = 'K';
                		$scope.sex = $scope.plci[0];
                	}

                	if($scope.sex == 'mężczyzna') {
                		sex = 'M';
                		$scope.sex = $scope.plci[1];
                	}

                	/*$log.log('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id +
                            '&sex=' + sex + '&age=' + $scope.age + '&phrase=' + $scope.phrase + '&category=' + $scope.cat.NAME);*/

                    $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id +
                                                                                                        '&sex=' + sex + '&age=' + $scope.age + '&phrase=' + $scope.phrase + '&category=' + $scope.cat.NAME)
                    .success(function(data){
                        $scope.runners = data;
                    })

                    .error(function(data,status,headers,config){
                        $scope.retInfo = 'Błąd!'+ data;
                    });
            }

           $scope.deleteRunner = function(compID, runnID) {
             if (confirm('Czy napewno chcesz usunąć zawodnika?')) {

                $http.delete('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event?owner_id='+token+'&competition_id=' + compID +
                                                                                                '&user_id='+runnID)
                .success(function(data){
                    if(data.code==230)
                    {
                        $scope.error = data.code;
                    }
                    else
                    {
                    $route.reload();
                    }

                })
                .error(function(data){
                    $scope.error = data;
                })
              }
            };

           $scope.runnerPaid = function(compID, runnID) {

                $http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/payment?owner_id='+token+'&competition_id=' + compID +
                                                                                                '&user_id='+runnID)
                .success(function(data){
                    $route.reload();
                })
                .error(function(data){
                    $scope.error = data;

                });
            };



            $scope.s = function() {

            	if($scope.sex != null) {
            		sessionStorage.setItem('sex', $scope.sex.nazwa);
            	}

            	sessionStorage.setItem('age', $scope.age);
            	sessionStorage.setItem('phrase', $scope.phrase);

            	if($scope.cat != null) {
            		sessionStorage.setItem('category', $scope.cat.NAME);
            	}

            	sessionStorage.setItem('hide', 0);
            	var ind = $scope.categories.indexOf($scope.cat);
            	sessionStorage.setItem('ind', ind);

            	$route.reload();
            };

            $scope.w = function() {
            	$route.reload();
            };

            $scope.init2 = function() {
            	$scope.check = 0;

            	//$log.log('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/category/list?competition_id=' + id);

            	$http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/category/list?competition_id=' + id)
                .success(function(data){
                    $scope.categories = data;
                    if($scope.categories == "") {
                    	$scope.check = 1;
                    }

                    var ind = sessionStorage.getItem('ind');

//                   $scope.wieloetapowe = sessionStorage.getItem('WIELOETAPOWE');
  //                  sessionStorage.setItem('WIELOETAPOWE', $scope.competition.WIELOETAPOWE);


                    if(ind != null)
                    	$scope.cat = $scope.categories[ind];

                    sessionStorage.removeItem('ind');
                })

                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });
            };

            $scope.confirmStartNumber = function(userID, compID, startNumber) {
                $http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/user/number?user_id=' + token
                                                                                        +'&user_to_number_id='+ userID
                                                                                        +'&competition_id='+ compID
                                                                                        +'&number='+startNumber)
                .success(function(data){
                    $scope.addStartNumberResult = data.content;
                    for(i=0; i<$scope.runners.length; i++)
                    {
                        if($scope.runners[i].USER_ID == userID)
                            $scope.runners[i].EVENT_NR= startNumber;
                    }

                })

                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });

            }

             $scope.showResultList = function(){
                sessionStorage.setItem('compID', id);
                $location.path('/Multi/home/myCompetition/results');
            }

                $scope.makeStage = function(){
                sessionStorage.setItem('name', $scope.name);
                 //sessionStorage.setItem('compName', $scope.competition.NAME);
                           $location.path('/Multi/home/myCompetition/stage');
                   }
                                $scope.editCompetition = function(){
                                        sessionStorage.setItem('compID', id);
                                        $location.path('/Multi/home/myCompetition/edit');

                                    }

                   $scope.showStage = function(){
                    sessionStorage.setItem('compID1', id);
                     $location.path('/Multi/home/myCompetitions/myStages');
                      }
    }])

    app.controller('compRunnersListController', ['$scope','$http', '$route', '$sessionStorage', '$log','$location', function($scope, $http, $route, $sessionStorage, $log, $location){


        $scope.hasStage = sessionStorage.getItem('stage');
        $scope.runners = [
                            {IMIE : ''},
                            {NAZWISKO : ''},
                            {COMPETITION_ID : ''},
                            {USER_ID: ''},
                            {OPLACONE: ''}
                            ];

        $scope.plci = [{nazwa: 'kobieta'}, {nazwa: 'mężczyzna'}];
        $scope.cat = [{NAME: ''}, {DESCRIPTION : ''}];

        var id = sessionStorage.getItem('compID');
        $scope.competitionName = sessionStorage.getItem('compName');

        $scope.compPay = sessionStorage.getItem('compPay');

            $scope.init = function() {

                $scope.init2();

                var sex = '';

                $scope.search = 0;
                $scope.check = 0;
                $scope.btnText = 'Rozwiń filtry wyszukiwania';

                $scope.spr = sessionStorage.getItem('hide');
                $scope.age = sessionStorage.getItem('age');
                $scope.sex = sessionStorage.getItem('sex');
                $scope.phrase = sessionStorage.getItem('phrase');
                $scope.cat.NAME = sessionStorage.getItem('category');

                sessionStorage.removeItem('hide');
                sessionStorage.removeItem('age');
                sessionStorage.removeItem('sex');
                sessionStorage.removeItem('phrase');
                sessionStorage.removeItem('category');

                $scope.print = function() {
                    if( $scope.search == 1 ) {
                        $scope.btnText = 'Rozwiń filtry wyszukiwania';
                        $scope.search = 0;
                    }

                    else {
                        $scope.btnText = 'Zwiń filtry wyszukiwania';
                        $scope.search = 1;
                    }

                };


                if($scope.spr != null)
                    $scope.print();

                if($scope.age == null)
                    $scope.age = '';

                if($scope.sex == null)
                    sex = '';

                    if($scope.phrase == null)
                        $scope.phrase = '';

                    if($scope.cat.NAME == null)
                        $scope.cat.NAME = '';

                    if($scope.sex == 'kobieta') {
                        sex = 'K';
                        $scope.sex = $scope.plci[0];
                    }

                    if($scope.sex == 'mężczyzna') {
                        sex = 'M';
                        $scope.sex = $scope.plci[1];
                    }

                    /*$log.log('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id +
                            '&sex=' + sex + '&age=' + $scope.age + '&phrase=' + $scope.phrase + '&category=' + $scope.cat.NAME);*/

                    $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id +
                                                                                                        '&sex=' + sex + '&age=' + $scope.age + '&phrase=' + $scope.phrase + '&category=' + $scope.cat.NAME)
                    .success(function(data){
                        $scope.runners = data;
                    })

                    .error(function(data,status,headers,config){
                        $scope.retInfo = 'Błąd!'+ data;
                    });
            };


            $scope.s = function() {

                if($scope.sex != null) {
                    sessionStorage.setItem('sex', $scope.sex.nazwa);
                }

                sessionStorage.setItem('age', $scope.age);
                sessionStorage.setItem('phrase', $scope.phrase);

                if($scope.cat != null) {
                    sessionStorage.setItem('category', $scope.cat.NAME);
                }

                sessionStorage.setItem('hide', 0);
                var ind = $scope.categories.indexOf($scope.cat);
                sessionStorage.setItem('ind', ind);

                $route.reload();
            };

            $scope.w = function() {
                $route.reload();
            };

            $scope.init2 = function() {
                $scope.check = 0;

                $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/category/list?competition_id=' + id)
                .success(function(data){
                    $scope.categories = data;
                    if($scope.categories == "") {
                        $scope.check = 1;
                    }

                    var ind = sessionStorage.getItem('ind');

                    if(ind != null)
                        $scope.cat = $scope.categories[ind];

                    sessionStorage.removeItem('ind');
                })

                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });
            };

            $scope.openPage = function() {
                sessionStorage.setItem('compID', id);
               // sessionStorage.setItem('compData', data);
                //sessionStorage.setItem('compGodzina', godzina);

                $location.path('/Multi/home/competition');
            };

            $scope.showResultList = function(){
                sessionStorage.setItem('compID', id);
                $location.path('/Multi/home/competition/results');
            }
            $scope.showStage = function(){
              sessionStorage.removeItem('name');
              sessionStorage.setItem('compID1', id);
              $location.path('/Multi/home/competitions/stages');
              }


    }])

    app.controller('signController', ['$scope','$http', '$location', '$sessionStorage', '$log', function($scope, $http, $location, $sessionStorage, $log){

    	$scope.check = 0;
        $scope.check2 = 0;
        $scope.check3 = 1;
        $scope.check5 = 0;
        $scope.check7 = 0;
    	$scope.text = "Zapisz się!";
    	$scope.cat = '';
    	$scope.categories = [];
        var zawody = [];
        var id = sessionStorage.getItem('compID');
        var dataRozp = sessionStorage.getItem('compData');
        var godzinaRozp = sessionStorage.getItem('compGodzina');

        var array1 = dataRozp.split(".");
        var array2 = godzinaRozp.split(":");

        for(i = 0; i < array1.length; i++){
        	array1[i] = parseInt(array1[i]);
        }

        for(i = 0; i < array2.length; i++){
        	array2[i] = parseInt(array2[i]);
        }



        var teraz = new Date();
        var dataZaw = new Date(array1[2], --array1[1], array1[0], array2[0], array2[1]);

        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?&type=&name=&place=&wieloetapowe=' + id)
                .success(function(data){
                $scope.response = data;

                for(var i=0; i<$scope.response.length; i++)
                {
                    zawody.push($scope.response[i].COMPETITION_ID);
                }
             })
                .error(function(data,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data;
                });

        //$log.log('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id + '&sex=&age=&phrase=&category=');

        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id + '&sex=&age=&phrase=&category=')
        .success(function(data){
        	var users = [];
            users = data;
            var imie = sessionStorage.getItem('IMIE');
            var nazwisko = sessionStorage.getItem('NAZWISKO');
            var email = sessionStorage.getItem('EMAIL');

        	for(i = 0; i < data.length; i++) {
        		if(users[i].IMIE == imie && users[i].NAZWISKO == nazwisko && users[i].EMAIL == email) {
        			$scope.check2 = 1;
        			$scope.check5 = 1;
        			$scope.text = "Wypisz się!";
        			break;
        		}
        	}

        	if(teraz > dataZaw){
        		$scope.retInfo = "Zawody już się zaczeły!";
        		$scope.check = 1;
        	}
        })

        .error(function(data,status,headers,config){
            $scope.retInfo = 'Błąd!'+ data;
        });

            $scope.sign = function(id) {
            	if($scope.check2 == 0) {

	            	var user = sessionStorage.getItem('ID');

	            	$http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event?user_id=' + user + '&competition_id=' + id + '&category_name=' + $scope.cat.NAME)
	                .success(function(data){
	                	if(data.content == 'Brak wolnych miejsc'){
	                		$scope.retInfo = 'Brak wolnych miejsc na te zawody!';
	                	}
	                	else{
	                		$scope.retInfo = "Zapis na zawody powiódł się!";
		                    $scope.check2 = 1;
		                    $scope.check5 = 1;
		                    $scope.text = "Wypisz się!";
	                	}
	                	for(var i=0; i<zawody.length; i++)
                        {
                             $http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event?user_id=' + user + '&competition_id=' + zawody[i] + '&category_name=' + $scope.cat.NAME)
                             	                .success(function(data){
                             	                	if(data.content == 'Brak wolnych miejsc'){
                             	                		$scope.retInfo = 'Brak wolnych miejsc na te zawody!';
                             	                	}
                             	                	else{
                             	                		$scope.retInfo = "Zapis na zawody powiódł się!";
                             		                    $scope.check2 = 1;
                             		                    $scope.check5 = 1;
                             		                    //$scope.text = "Wypisz się!";
                             	                	}
                             	                })
                             	                .error(function(data,status,headers,config){
                             	                    $scope.retInfo = 'Błąd!'+ data;
                             	                });
                        }
	                })

	                .error(function(data,status,headers,config){
	                    $scope.retInfo = 'Błąd!'+ data;
	                });
            	}

            	else {
            		$scope.signOut(id);
            		$scope.retInfo = '';
            		$scope.check = 1;
            		$scope.check3 = 0;
            	}
            };

            $scope.signOut = function(id) {
            	var user = sessionStorage.getItem('ID');
            	$http.delete('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/leave?competition_id=' + id + '&user_id=' + user)
                .success(function(data){
                    $scope.retInfo = "Wypis z zawodów powiódł się!";
                    $scope.check = 0;
                    $scope.check2 = 0;
                    $scope.check3 = 1;
                    $scope.check5 = 0;
                    $scope.text = "Zapisz się!";
                })

                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });
            };

            $scope.init = function() {
            	$scope.check5 = 0;
            	$scope.init2();
            	//$log.log('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/category/list?competition_id=' + $scope.id);
            	$http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/category/list?competition_id=' + $scope.id)
                .success(function(data){
                    $scope.categories = data;
                    if($scope.categories == "") {
                    	$scope.check6 = 1;
                    }
                })

                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });
            };

            $scope.init2 = function() {
            	$http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + $scope.id)
                .success(function(data){

                    if(data.DEACTIVATED == 'true') {
                    	$scope.check = 1;
                    	$scope.check7 = 1;
                    }

                })
                .error(function(data,status,headers,config){
                    $scope.retInfo = 'Błąd!'+ data;
                });
            }
    }])

    app.controller('addCompetitionController', ['$scope', '$http','$location','$window', '$sessionStorage' , function($scope, $http, $location, $window,$sessionStorage, $moment){

                    // Editor options.
                      $scope.options = {
                        language: 'pl',
                        allowedContent: true,
                        entities: false
                      };


                    $scope.status = 'Dodaj zawody';

                    $scope.types = [
                    {name:'Bieg przełajowy' ,type:'Biegi'},
                    {name:'Bieg maratoński' ,type:'Biegi'},
                    {name:'Bieg uliczny' ,type:'Biegi'},
                    {name:'Bieg górski' ,type:'Biegi'},
                    {name:'Chód' ,type:'Biegi'},
                    {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                    {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                    {name:'Bieg narciarski' ,type:'Narciarskie'},
                    {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                    {name:'Wyścig samolotów' ,type:'Powietrzne'},
                    {name:'Wyścig balonów' ,type:'Powietrzne'},
                    {name:'Wyścig samochodowy' ,type:'Motorowe'},
                    {name:'Wyścig off-road' ,type:'Motorowe'},
                    {name:'Karting' ,type:'Motorowe'},
                    {name:'Wyścig motocykli' ,type:'Motorowe'},
                    {name:'Wyścig quadów' ,type:'Motorowe'},
                    {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                    {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                    {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                    {name:'Inne' ,type:'Inne'}
                    ];

                    $scope.competition = {
                    memberLimitCheck : 'false'
                    };

                    $scope.logo = {
                    "filesize": 54836, /* bytes */
                    "filetype": "",
                    "filename": "",
                    "base64":   ""
                    }
        ///////////////////////////////////////////DATEPICKER///////////////////////////////////////////////////////////////////

             $scope.today = function() {
                $scope.dt = new Date();
              };
              $scope.today();

              $scope.dateOptions = {
                formatYear: 'yy',
                minDate: new Date(),
                startingDay: 1
              };

              $scope.open1 = function() {
                $scope.popup1.opened = true;
              };

              $scope.open2 = function() {
                $scope.popup2.opened = true;
              };

              $scope.popup1 = {
                opened: false
              };

              $scope.popup2 = {
                opened: false
              };

              function getDayClass(data) {
                var date = data.date,
                  mode = data.mode;
                if (mode === 'day') {
                  var dayToCheck = new Date(date).setHours(0,0,0,0);

                  for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                    }
                  }
                }

                return '';
              }

        /////////////////////////////////////////////TIMEPICKER/////////////////////////////////////////////////////////////////////

        $scope.ismeridian = false;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var limit;  //limit uczestnikow przesylany w zapytaniu
                    var cost;
                    var user = sessionStorage.getItem('ID');

                    $scope.addCompetitionClick = function(){


                         if($scope.competition.memberLimitCheck)
                            {
                                limit = $scope.competition.memberLimit;
                            }
                         else
                            {
                                limit = '';
                            }

                         if($scope.competition.payCheck)
                            {
                                cost = $scope.competition.pay;
                            }
                         else
                            {
                                cost = '';
                            }


                    $http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?user_id='+ user+
                                                                            '&name=' +$scope.competition.name+
                                                                            '&data_rozp='+moment($scope.competition.startDate).format('DD.MM.YYYY')+
                                                                            '&czas_rozp='+moment($scope.competition.startTime).format('HH:mm')+
                                                                            '&data_zak='+moment($scope.competition.endDate).format('DD.MM.YYYY')+
                                                                            '&czas_zak=' + moment($scope.competition.endTime).format('HH:mm')+
                                                                            '&typ=' + $scope.competition.type.name+
                                                                            '&limit_ucz=' + limit +
                                                                            '&miejscowosc=' + $scope.competition.city +
                                                                            '&oplata=' + cost +
                                                                            '&opis=' + $scope.competition.description +
                                                                            '&image='+ $scope.logo.base64 +
                                                                            '&wieloetapowe=' + 0)
                            .success(function (data) {

                               if(data.content = "Competitions Created")
                               {
                                $scope.requestResult = "Zawody zostały utworzone! Pamiętaj, że aby zawodnicy mogli zapisywać się na te zawody musisz jeszcze utworzyć kategorie. Możesz to zrobić w menu zaodów.";
                                $window.scrollTo(0, 0);
                                $scope.competition.name = "";
                                $scope.competition.startDate = "";
                                $scope.competition.startTime = "";
                                $scope.competition.endDate = "";
                                $scope.competition.endTime = "";
                                $scope.competition.type.name = "";
                                $scope.competition.payCheck = false;
                                $scope.competition.pay = "";
                                $scope.competition.memberLimitCheck = false;
                                $scope.competition.memberLimit = "";
                                $scope.competition.city = "";
                                $scope.competition.description = "";
                                $scope.logo = null;
                               }



                            })
                            .error(function (data) {
                                $scope.requestResult = 'Błąd! Nie udało się dodać zawodów.';
                            });
                    };

    }])
     app.controller('addMultiCompetitionController', ['$scope', '$http','$location','$window', '$sessionStorage' , function($scope, $http, $location, $window,$sessionStorage, $moment){

                        // Editor options.
                          $scope.options = {
                            language: 'pl',
                            allowedContent: true,
                            entities: false
                          };


                        $scope.status = 'Dodaj zawody';

                        $scope.types = [
                        {name:'Bieg przełajowy' ,type:'Biegi'},
                        {name:'Bieg maratoński' ,type:'Biegi'},
                        {name:'Bieg uliczny' ,type:'Biegi'},
                        {name:'Bieg górski' ,type:'Biegi'},
                        {name:'Chód' ,type:'Biegi'},
                        {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                        {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                        {name:'Bieg narciarski' ,type:'Narciarskie'},
                        {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                        {name:'Wyścig samolotów' ,type:'Powietrzne'},
                        {name:'Wyścig balonów' ,type:'Powietrzne'},
                        {name:'Wyścig samochodowy' ,type:'Motorowe'},
                        {name:'Wyścig off-road' ,type:'Motorowe'},
                        {name:'Karting' ,type:'Motorowe'},
                        {name:'Wyścig motocykli' ,type:'Motorowe'},
                        {name:'Wyścig quadów' ,type:'Motorowe'},
                        {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                        {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                        {name:'Mieszane' ,type:'Inne'},
                        {name:'Inne' ,type:'Inne'}
                        ];

                        $scope.competition = {
                        memberLimitCheck : 'false'
                        };

                        $scope.logo = {
                        "filesize": 54836, /* bytes */
                        "filetype": "",
                        "filename": "",
                        "base64":   ""
                        }
            ///////////////////////////////////////////DATEPICKER///////////////////////////////////////////////////////////////////

                 $scope.today = function() {
                    $scope.dt = new Date();
                  };
                  $scope.today();

                  $scope.dateOptions = {
                    formatYear: 'yy',
                    minDate: new Date(),
                    startingDay: 1
                  };

                  $scope.open1 = function() {
                    $scope.popup1.opened = true;
                  };

                  $scope.open2 = function() {
                    $scope.popup2.opened = true;
                  };

                  $scope.popup1 = {
                    opened: false
                  };

                  $scope.popup2 = {
                    opened: false
                  };

                  function getDayClass(data) {
                    var date = data.date,
                      mode = data.mode;
                    if (mode === 'day') {
                      var dayToCheck = new Date(date).setHours(0,0,0,0);

                      for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                        if (dayToCheck === currentDay) {
                          return $scope.events[i].status;
                        }
                      }
                    }

                    return '';
                  }

            /////////////////////////////////////////////TIMEPICKER/////////////////////////////////////////////////////////////////////

            $scope.ismeridian = false;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        var limit;  //limit uczestnikow przesylany w zapytaniu
                        var cost;
                        var user = sessionStorage.getItem('ID');

                        $scope.addMultiCompetitionClick = function(){


                             if($scope.competition.memberLimitCheck)
                                {
                                    limit = $scope.competition.memberLimit;
                                }
                             else
                                {
                                    limit = '';
                                }

                             if($scope.competition.payCheck)
                                {
                                    cost = $scope.competition.pay;
                                }
                             else
                                {
                                    cost = '';
                                }


                        $http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?user_id='+ user+
                                                                                '&name=' +$scope.competition.name+
                                                                                '&data_rozp='+moment($scope.competition.startDate).format('DD.MM.YYYY')+
                                                                                '&czas_rozp='+moment($scope.competition.startTime).format('HH:mm')+
                                                                                '&data_zak='+moment($scope.competition.endDate).format('DD.MM.YYYY')+
                                                                                '&czas_zak=' + moment($scope.competition.endTime).format('HH:mm')+
                                                                                '&typ=' + $scope.competition.type.name+
                                                                                '&limit_ucz=' + limit +
                                                                                '&miejscowosc=' + $scope.competition.city +
                                                                                '&oplata=' + cost +
                                                                                '&opis=' + $scope.competition.description +
                                                                                '&image='+ $scope.logo.base64 +
                                                                                '&wieloetapowe=' + 1)
                                .success(function (data) {

                                   if(data.content = "Competitions Created")
                                   {
                                    $scope.requestResult = "Zawody zostały utworzone! Pamiętaj, że aby zawodnicy mogli zapisywać się na te zawody musisz jeszcze utworzyć kategorie. Możesz to zrobić w menu zaodów.";
                                    $window.scrollTo(0, 0);
                                    $scope.competition.name = "";
                                    $scope.competition.startDate = "";
                                    $scope.competition.startTime = "";
                                    $scope.competition.endDate = "";
                                    $scope.competition.endTime = "";
                                    $scope.competition.type.name = "";
                                    $scope.competition.payCheck = false;
                                    $scope.competition.pay = "";
                                    $scope.competition.memberLimitCheck = false;
                                    $scope.competition.memberLimit = "";
                                    $scope.competition.city = "";
                                    $scope.competition.description = "";
                                    $scope.logo = null;
                                   }



                                })
                                .error(function (data) {
                                    $scope.requestResult = 'Błąd! Nie udało się dodać zawodów.';
                                });
                        };

        }])
    app.controller('makeStageController', ['$scope', '$http','$location','$window', '$sessionStorage' , function($scope, $http, $location, $window,$sessionStorage, $moment){

                    // Editor options.
                      $scope.options = {
                        language: 'pl',
                        allowedContent: true,
                        entities: false
                      };
                     $scope.hasStage = sessionStorage.getItem('stage');
                     $scope.name = sessionStorage.getItem('name');
                    $scope.status = 'Dodaj etap';
                     $scope.editActive = sessionStorage.getItem('editActive');

                    $scope.types = [
                    {name:'Bieg przełajowy' ,type:'Biegi'},
                    {name:'Bieg maratoński' ,type:'Biegi'},
                    {name:'Bieg uliczny' ,type:'Biegi'},
                    {name:'Bieg górski' ,type:'Biegi'},
                    {name:'Chód' ,type:'Biegi'},
                    {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                    {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                    {name:'Bieg narciarski' ,type:'Narciarskie'},
                    {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                    {name:'Wyścig samolotów' ,type:'Powietrzne'},
                    {name:'Wyścig balonów' ,type:'Powietrzne'},
                    {name:'Wyścig samochodowy' ,type:'Motorowe'},
                    {name:'Wyścig off-road' ,type:'Motorowe'},
                    {name:'Karting' ,type:'Motorowe'},
                    {name:'Wyścig motocykli' ,type:'Motorowe'},
                    {name:'Wyścig quadów' ,type:'Motorowe'},
                    {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                    {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                    {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                    {name:'Inne' ,type:'Inne'}
                    ];

                    $scope.competition = {
                    memberLimitCheck : 'false'
                    };

                    $scope.logo = {
                    "filesize": 54836, /* bytes */
                    "filetype": "",
                    "filename": "",
                    "base64":   ""
                    }
        ///////////////////////////////////////////DATEPICKER///////////////////////////////////////////////////////////////////

             $scope.today = function() {
                $scope.dt = new Date();
              };
              $scope.today();

              $scope.dateOptions = {
                formatYear: 'yy',
                minDate: new Date(),
                startingDay: 1
              };

              $scope.open1 = function() {
                $scope.popup1.opened = true;
              };

              $scope.open2 = function() {
                $scope.popup2.opened = true;
              };

              $scope.popup1 = {
                opened: false
              };

              $scope.popup2 = {
                opened: false
              };

              function getDayClass(data) {
                var date = data.date,
                  mode = data.mode;
                if (mode === 'day') {
                  var dayToCheck = new Date(date).setHours(0,0,0,0);

                  for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                    }
                  }
                }

                return '';
              }

        /////////////////////////////////////////////TIMEPICKER/////////////////////////////////////////////////////////////////////

        $scope.ismeridian = false;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var limit;  //limit uczestnikow przesylany w zapytaniu
                    var cost;
                    var user = sessionStorage.getItem('ID');
                    var id = sessionStorage.getItem('compID');

                    $scope.makeStageClick = function(){

                    $http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?user_id='+ user+
                                                                            '&name=' +$scope.competition.name+
                                                                            '&data_rozp='+moment($scope.competition.startDate).format('DD.MM.YYYY')+
                                                                            '&czas_rozp='+moment($scope.competition.startTime).format('HH:mm')+
                                                                            '&data_zak='+moment($scope.competition.endDate).format('DD.MM.YYYY')+
                                                                            '&czas_zak=' + moment($scope.competition.endTime).format('HH:mm')+
                                                                            '&typ=' + $scope.competition.type.name+
                                                                            '&limit_ucz=' + '' +
                                                                            '&miejscowosc=' + $scope.competition.city +
                                                                            '&oplata=' + '' +
                                                                            '&opis=' + $scope.competition.description +
                                                                            '&image='+ $scope.logo.base64 +
                                                                            '&wieloetapowe=' + id)
                            .success(function (data) {

                               if(data.content = "Competitions Created")
                               {
                                $scope.requestResult = "Etap został utworzony! Pamiętaj, że aby zawodnicy mogli zapisywać się na ten etap musisz jeszcze utworzyć klasyfikacje. Możesz to zrobić w menu zawodów po wybraniu danego etapu.";
                                $window.scrollTo(0, 0);
                                $scope.competition.name = "";
                                $scope.competition.startDate = "";
                                $scope.competition.startTime = "";
                                $scope.competition.endDate = "";
                                $scope.competition.endTime = "";
                                $scope.competition.type.name = "";
                                $scope.competition.payCheck = false;
                                $scope.competition.pay = "";
                                $scope.competition.memberLimitCheck = false;
                                $scope.competition.memberLimit = "";
                                $scope.competition.city = "";
                                $scope.competition.description = "";
                                $scope.logo = null;
                               }



                            })
                            .error(function (data) {
                                $scope.requestResult = 'Błąd! Nie udało się dodać etapu.';
                            });
                    };
                        $scope.backClick = function(){
                            $location.path('/Multi/home/myCompetition');
                        };


                                              $scope.showResultList = function(){
                                                    sessionStorage.setItem('compID', id);
                                                    $location.path('/Multi/home/myCompetition/results');
                                                }

                                                $scope.showRunnersList = function(){
                                                                        sessionStorage.setItem('compID', id);
                                                                        $location.path('/Multi/home/myCompetition/runnersList');

                                                                    }

                                                                $scope.showDescription = function(){
                                                                        sessionStorage.setItem('compID', id);
                                                                        $location.path('/Multi/home/myCompetition');

                                                                    }

                                                                $scope.editCompetition = function(){
                                                                        sessionStorage.setItem('compID', id);
                                                                        $location.path('/Multi/home/myCompetition/edit');

                                                                    }

                                                                     $scope.showStage = function(){
                                                                     sessionStorage.removeItem('name');
                                                                                        sessionStorage.setItem('compID1', id);
                                                                                         $location.path('/Multi/home/myCompetitions/myStages');
                                                                                          }
    }])

   app.controller('makeClassificationController', ['$scope', '$http','$location','$window', '$sessionStorage' , function($scope, $http, $location, $window,$sessionStorage, $moment){


                 $scope.editActive = sessionStorage.getItem('editActive');
                 $scope.competition = [];
                 var pointTab = [];
                 var timeTab = [];
                            var arr = [];
                            var start = [];
                            var srodek = [];
                            var meta = [];
                            var POI = [];
                            var POIname = [];
                  var nrOfLine;
                 $scope.id = sessionStorage.getItem('compID');
                 $scope.ilePKT = sessionStorage.getItem('ilePKT');
                 $scope.name = sessionStorage.getItem('name');
                     $scope.competition1 = [];
                 $scope.lines = [];
                 $scope.status = 'Ustal klasyfikacje';
                var user = sessionStorage.getItem('ID');
                        // Editor options.
                          $scope.options = {
                            language: 'pl',
                            allowedContent: true,
                            entities: false
                          };

                        $scope.types = [
                        {name:'Klasyfikacja generalna' },
                        {name:'Klasyfikacja generalna drużynowa' },
                        {name:'Klasyfikacja punktowa'}
                        ];

            //czy ma trase
            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/gps/all?competition_id='+ $scope.id)
                            .success(function(data){
                          $scope.competition1 = data;


                            for(var i=0; i<data[2].COUNT; i++) {
                              arr.push(data[2]["POINTY"+(i)].replace(/"/g, ""));
                              arr.push(data[2]["POINTX"+(i)].replace(/"/g, ""));
                            }

                               start.push(data[0]["START1y"]);
                               start.push(data[0]["START1x"]);
                               start.push(data[0]["START2y"]);
                               start.push(data[0]["START2x"]);

                                meta.push(data[0]["META1y"]);
                                meta.push(data[0]["META1x"]);
                                meta.push(data[0]["META2y"]);
                                meta.push(data[0]["META2x"]);

                        for(var i=0; i<data[0].COUNT; i++) {
                              srodek.push(data[0]["PUNKT"+(i)+"Ay"]);
                              srodek.push(data[0]["PUNKT"+(i)+"Ax"]);
                              srodek.push(data[0]["PUNKT"+(i)+"By"]);
                              srodek.push(data[0]["PUNKT"+(i)+"Bx"]);
                            }

                    for(var i=0; i<data[1].COUNT; i++) {
                              POI.push(data[1]["POINT_POIY"+(i)]);
                              POI.push(data[1]["POINT_POIX"+(i)]);
                              POIname.push(data[1]["POINT_POINAME"+(i)]);
                            }

                            sessionStorage.setItem('trasa',JSON.stringify(arr));
                            sessionStorage.setItem('start',JSON.stringify(start));
                            sessionStorage.setItem('meta',JSON.stringify(meta));
                            sessionStorage.setItem('srodek',JSON.stringify(srodek));
                            sessionStorage.setItem('POI',JSON.stringify(POI));
                            sessionStorage.setItem('POIname',JSON.stringify(POIname));
                            $scope.czyjuzjest = 1;
                          })
             .error(function(data,status,headers,config){
                         $scope.retInfo = 'Błąd!'+ data;
            });

                         for(var i=0; i< $scope.ilePKT; i++){
                            $scope.lines[i]={name:'Linia pomiarowa nr ' + (i+1)};
                         }
                         $scope.lines[i]={name:'META'};

                        var user = sessionStorage.getItem('ID');


                         $scope.showDescription = function(){
                         sessionStorage.setItem('compID', $scope.id);
                         $location.path('/Multi/home/myCompetition');
                         }

                        $scope.editCompetition = function(){
                       sessionStorage.setItem('compID', $scope.id);
                        $location.path('/Multi/home/myCompetition/edit');

                             }

         $scope.addPoint = function() {
                    nrOfLine = $scope.classification.lines.name;
                    if(nrOfLine=="META"){
                    pointTab.push("X_"+$scope.classification.NrOfPoints+"_"+$scope.classification.points);
                    $scope.requestResult1 = "Dodałeś " + $scope.classification.points + " pktów dla "+$scope.classification.NrOfPoints+"-go zawodnika na mecie";
                    }
                    else {
                    var res = nrOfLine.substring(nrOfLine.lastIndexOf(' '),nrOfLine.length);
                    pointTab.push(res+"_"+$scope.classification.NrOfPoints+"_"+$scope.classification.points);
                    $scope.requestResult1 = "Dodałeś " + $scope.classification.points + " pktów dla "+$scope.classification.NrOfPoints+"-go zawodnika na linii pomiarowej nr "+res;
                    }
                };

        $scope.addTime1 = function() {
                    nrOfLine = $scope.classification.lines.name;
                    if(nrOfLine=="META"){
                     timeTab.push("X_"+$scope.classification.NrOfTimePoints+"_"+$scope.classification.timepoints);
                     $scope.requestResult2 = "Odjąłeś " + $scope.classification.timepoints + " bonusowych sekund dla "+$scope.classification.NrOfTimePoints+"-go zawodnika na mecie";
                      }
                       else {
                       var res = nrOfLine.substring(nrOfLine.lastIndexOf(' '),nrOfLine.length);
                       timeTab.push(res+"_"+$scope.classification.NrOfTimePoints+"_"+$scope.classification.timepoints);
                       $scope.requestResult2 = "Odjąłeś " + $scope.classification.timepoints + " bonusowych sekund dla "+$scope.classification.NrOfTimePoints+"-go zawodnika na linii pomiarowej nr "+res;
                     }
                };


             $scope.addMultiCompetitionClick = function(id) {
if(id==2){
                  if(timeTab.length==0 || pointTab.length ==0)  {
                    $scope.requestResult = 'Błąd! Nie dodałeś punktacji.';
                  }
                    else {
                 $http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?owner_id='+ user+
                                                                                            '&competition_id=' +$scope.id+
                                                                                            '&typ='+$scope.classification.type.name+
                                                                                            '&points='+pointTab.toString()+
                                                                                            '&timebonus='+timeTab.toString())
                                            .success(function (data) {

                                               if(data.content = "Classification added")
                                               {
                                                $scope.requestResult = "Klasyfikacja została utworzona!";
                                                $window.scrollTo(0, 0);
                                               }

                                            })
                                            .error(function (data) {
                                                $scope.requestResult = 'Błąd! Nie udało się stworzyć klasyfikacji.';
                                                $window.scrollTo(0, 0);
                                            });
                                    }
                                    } else {
                                                      $http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?owner_id='+ user+
                                                                                                                                 '&competition_id=' +$scope.id+
                                                                                                                                 '&typ='+$scope.classification.type.name+
                                                                                                                                 '&points='+pointTab.toString()+
                                                                                                                                 '&timebonus='+timeTab.toString())
                                                                                 .success(function (data) {

                                                                                    if(data.content = "Classification added")
                                                                                    {
                                                                                     $scope.requestResult = "Klasyfikacja została utworzona!";
                                                                                     $window.scrollTo(0, 0);
                                                                                    }

                                                                                 })
                                                                                 .error(function (data) {
                                                                                     $scope.requestResult = 'Błąd! Nie udało się stworzyć klasyfikacji.';
                                                                                     $window.scrollTo(0, 0);
                                                                                 });
                                                                         }

                };
        }])


    app.controller('editCompetitionController', ['$scope','$http', '$location', '$sessionStorage', '$log', '$window', function($scope, $http, $location, $sessionStorage, $log, $window){

            ///////////////////////////////////////////DATEPICKER///////////////////////////////////////////////////////////////////

            $scope.ilePKT = sessionStorage.getItem('ilePKT');
            $scope.today = function() {
              $scope.dt = new Date();
              };
              $scope.today();

              $scope.dateOptions = {
                formatYear: 'yy',
                minDate: new Date(),
                startingDay: 1
              };

              $scope.open1 = function() {
                $scope.popup1.opened = true;
              };

              $scope.open2 = function() {
                $scope.popup2.opened = true;
              };

              $scope.popup1 = {
                opened: false
              };

              $scope.popup2 = {
                opened: false
              };

              function getDayClass(data) {
                var date = data.date,
                  mode = data.mode;
                if (mode === 'day') {
                  var dayToCheck = new Date(date).setHours(0,0,0,0);

                  for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                    }
                  }
                }

                return '';
              }

        /////////////////////////////////////////////TIMEPICKER/////////////////////////////////////////////////////////////////////

        $scope.ismeridian = false;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    $scope.types = [
                                {name:'Bieg przełajowy' ,type:'Biegi'},
                                {name:'Bieg maratoński' ,type:'Biegi'},
                                {name:'Bieg uliczny' ,type:'Biegi'},
                                {name:'Bieg górski' ,type:'Biegi'},
                                {name:'Chód' ,type:'Biegi'},
                                {name:'Kolarstwo szosowe' ,type:'Rowerowe'},
                                {name:'Kolarstwo górskie' ,type:'Rowerowe'},
                                {name:'Bieg narciarski' ,type:'Narciarskie'},
                                {name:'Narciarstwo alpejskie' ,type:'Narciarskie'},
                                {name:'Wyścig samolotów' ,type:'Powietrzne'},
                                {name:'Wyścig balonów' ,type:'Powietrzne'},
                                {name:'Wyścig samochodowy' ,type:'Motorowe'},
                                {name:'Wyścig off-road' ,type:'Motorowe'},
                                {name:'Karting' ,type:'Motorowe'},
                                {name:'Wyścig motocykli' ,type:'Motorowe'},
                                {name:'Wyścig quadów' ,type:'Motorowe'},
                                {name:'Wyścig skuterów śnieżnych' ,type:'Motorowe'},
                                {name:'Kajakarstwo' ,type:'Wyścigi łodzi'},
                                {name:'Wioślarstwo' ,type:'Wyścigi łodzi'},
                                {name:'Inne' ,type:'Inne'}
                                ];

                    // Editor options.
                    $scope.options = {
                      language: 'pl',
                      allowedContent: true,
                      entities: false
                    };

                    $scope.competition = [];
                    var id = sessionStorage.getItem('compID');
                    var user_id = sessionStorage.getItem('ID');


                    $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + id)
                        .success(function(response){
                            var datePattern = /(\d{2}).(\d{2}).(\d{4})/;
                            var timePattern = /(\d{2}):(\d{2})/;
			                $scope.competition.wieloetapowe = response.WIELOETAPOWE;
                            $scope.competition.name = response.NAME;
                            $scope.competition.startDate = new Date(response.DATA_ROZP.replace(datePattern, '$3-$2-$1'));
                            $scope.competition.startTime = new Date().setHours(response.CZAS_ROZP.replace(timePattern, '$1'),response.CZAS_ROZP.replace(timePattern, '$2'));
                            $scope.competition.endDate = new Date(response.DATA_ZAK.replace(datePattern, '$3-$2-$1'));
                            $scope.competition.endTime = new Date().setHours(response.CZAS_ZAK.replace(timePattern, '$1'),response.CZAS_ZAK.replace(timePattern, '$2'));
                            $scope.competition.city = response.MIEJSCOWOSC;
                            for(i=0 ; i < $scope.types.length; i++)
                            {
                                if($scope.types[i].name == response.TYP)
                                    break;
                            }
                            $scope.competition.type = $scope.types[i];
                            $scope.competition.pay = response.OPLATA;
                            if(response.OPLATA != "")
                                {$scope.competition.payCheck = true}
                            $scope.competition.memberLimit = response.LIMIT_UCZ;
                            if(response.LIMIT_UCZ != "")
                                {$scope.competition.memberLimitCheck = true}
                            $scope.competition.description = response.OPIS;

                        })

                        .error(function(data,status,headers,config){
                            $scope.retInfo = 'Błąd!'+ data;
                        });

                var limit;
                var cost;
                $scope.saveEditCompetitionClick = function(){


                                     if($scope.competition.memberLimitCheck)
                                        {
                                            limit = $scope.competition.memberLimit;
                                        }
                                     else
                                        {
                                            limit = '';
                                        }

                                     if($scope.competition.payCheck)
                                        {
                                            cost = $scope.competition.pay;
                                        }
                                     else
                                        {
                                            cost = '';
                                        }

                                $http.post('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?user_id='+ user_id +
                                                                                        '&competition_id='+ id+
                                                                                        '&name=' +$scope.competition.name+
                                                                                        '&data_rozp='+moment($scope.competition.startDate).format('DD.MM.YYYY')+
                                                                                        '&czas_rozp='+moment($scope.competition.startTime).format('HH:mm')+
                                                                                        '&data_zak='+moment($scope.competition.endDate).format('DD.MM.YYYY')+
                                                                                        '&czas_zak=' + moment($scope.competition.endTime).format('HH:mm')+
                                                                                        '&typ=' + $scope.competition.type.name+
                                                                                        '&limit_ucz=' + limit +
                                                                                        '&miejscowosc=' + $scope.competition.city +
                                                                                        '&oplata=' + cost +
                                                                                        '&opis=' + $scope.competition.description +
                                                                                        '&wieloetapowe=' + $scope.competition.wieloetapowe)
                                        .success(function (data) {
                                            $window.scrollTo(0, 0);
                                           $scope.requestResult = 'Zapisano zmiany!';

                                        })
                                        .error(function (data) {
                                            $window.scrollTo(0, 0);
                                            $scope.requestResult = 'Błąd! Nie udało się edytować zawodów.';
                                        });
                                };

                        $scope.backClick = function(){
                            $location.path('/Multi/home/myCompetition');
                        };

                        $scope.showRunnersList = function(){
                            sessionStorage.setItem('compID', id);
                            sessionStorage.setItem('compName', $scope.competition.name);
                            sessionStorage.setItem('compPay', cost);
                            $location.path('/Multi/home/myCompetition/runnersList');

                        }

                            $scope.showResultList = function(){
                            sessionStorage.setItem('compID', id);
                            $location.path('/Multi/home/myCompetition/results');
                            }

                                    $scope.showDescription = function(){
                                        sessionStorage.setItem('compID', id);
                                        $location.path('/Multi/home/competition');

                                    }
                                    $scope.editCompetition = function(){
                                                sessionStorage.setItem('compID', id);

                                                $location.path('/Multi/home/myCompetition/edit');

                                            }
                                $scope.makeStage = function(){
                                            sessionStorage.setItem('name', $scope.competition.name);
                                              $location.path('/Multi/home/myCompetition/stage');

                                 }
                                 $scope.showStage = function(){
                                               sessionStorage.setItem('compID1', id);
                                              $location.path('/Multi/home/myCompetitions/myStages');
                                              }

                $scope.makeClassification = function(){
                sessionStorage.setItem('compID', id);
                sessionStorage.setItem('name', $scope.competition.name);
                sessionStorage.setItem('ilePKT', $scope.ilePKT);
                $location.path('/Multi/home/myCompetition/makeClassification');
            }

    }])
app.factory('myService', function($http) {
    var _getData = function(ID) {
        return $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+ID)
        .then(function(result){
        return result.data;
        });
    };
    return { getData: _getData };
});

app.controller('resultListController', ['$scope','$timeout', '$filter', '$http', '$route', '$sessionStorage', '$log', '$location', 'myService', function($scope,$timeout, $filter, $http, $route, $sessionStorage, $log, $location, myService){

             var id = sessionStorage.getItem('compID');
             $scope.hasStage = sessionStorage.getItem('stage');
                    $scope.runners = [];
                    $scope.runnersDruz = [];
                    $scope.runners1 = [];
                    $scope.zawodnicy = [];
                    $scope.runners1 = [];
                    $scope.classPoints = [];
                    $scope.classPoints1 = [];
                     $scope.runners2 = [];
                    $scope.wyniki = [];
                    $scope.wynikii = [];
                    $scope.wyniki1 = [];
                    $scope.wynikiTimes = [];
                    $scope.timesColumn = [];
                    var zawody = new Array();
                    $scope.wynikOgolnych = [];
                    var czyWypelnic = 0;
                    $scope.idZawPunkt = 0;
                    $scope.zawodyKlasyfikacje = [];
                    $scope.zawodyKlasyfikacje1 = [];

$scope.listaWynikow1 = [];
var suma = 0;
            $scope.daneEtapow = [];
            var info = "";
            $scope.infoWielo = "";
            var m = 1;
            var n = 0;
            var cc;
var ileZawodnikow = 0;
            $scope.types = [];
            $scope.classification = [
                           {name:'Klasyfikacja generalna' },
                           {name:'Klasyfikacja punktowa' },
                           {name:'Klasyfikacja generalna drużynowa' }
                                                  ];
                        var xd=0;

        $scope.init = function() {
                $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + id)
                .success(function(data1){
                 info = data1;
                 $scope.infoWielo = data1.WIELOETAPOWE;
                 if($scope.infoWielo==1){
                             $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=&name=&place=&wieloetapowe=' + id)
                                 .success(function(data){
                                 $scope.daneEtapow = data;
                                 $scope.wypelnijEtapy();
                                    })
                                .error(function(data,status,headers,config){
                                 $scope.retInfo = 'Błąd!'+ data;
                                 // console.log('Błąd1!'+ data);
                                  });
                 }
                else if($scope.infoWielo==0){
                    $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+id)
                    .success(function(data){
                        $scope.runners = data;
                        if($scope.runners[1] != null)
                        {
                            $scope.timesColumn = [];
                            for(var i=0;i<$scope.runners[0].POINTS_COUNT;i++)
                            {
                                $scope.timesColumn[i] = i+1;
                            }
                            for(var i=1; i < $scope.runners.length; i++)
                            {
                                $scope.runners[i].MIEJSCE = i;

                                $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                {
                                    var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                    $scope.runners[i].TIMES[j] = eval(timeName);
                                }
                            }
                        }
                    })
                    .error(function(data,status,headers,config){
                        $scope.retInfo = 'Błąd!'+ data;
                    });
                }
             })
                .error(function(data1,status,headers,config){
                $scope.retInfo = 'Błąd!'+ data1;
                });

                $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id + '&sex=&age=&phrase=&category=')
                                    .success(function(data){
                                        $scope.zawodnicy = data;
                                    })

                                    .error(function(data,status,headers,config){
                                        $scope.retInfo = 'Błąd!'+ data;
                                    });
            }
                                            //wypelnijKlasyfikacje
                                       $scope.wypelnijKlasyfikacje = function(idZawodow) {
                                            if($scope.daneEtapow[idZawodow] != undefined && $scope.competition.type.name!=(cc +". Ogólne")){
                                            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                         .success(function(data){
                                                                            $scope.classification.length=0;
                                                                            $scope.classification = [
                                                                                            {name:'Klasyfikacja generalna' }
                                                                                                   ];
                                                        // $scope.classification[1] = [name:'Klasyfikacja generalna']
                                                         if(data.TYP != 'Klasyfikacja generalna') $scope.classification[1] = {name:data.TYP};
                                                        else $scope.classification.length=1;
                                                         })
                                                         .error(function(data,status,headers,config){
                                                                                              $scope.retInfo = 'Błąd!'+ data;
                                                                                         //     console.log('Błąd3!'+ data);
                                                                                              });
                                                                        }
                                                                        }

                                      $scope.wypelnijEtapy = function() {
                                                            for(var dd =0; dd<$scope.daneEtapow.length; dd++)
                                                             {
                                                                          $scope.types[dd]={id: dd, name:dd+1 +". " + $scope.daneEtapow[dd].NAME + " - " + $scope.daneEtapow[dd].DATA_ROZP};
                                                             }
                                                              cc = dd+1;
                                                              $scope.types[dd]={name:cc +". Ogólne"};
                                                 }


                                     //klasyfikacja generalna
                                    $scope.wynikiGeneralnej = function(idZawodow) { czyWypelnic = 1;
                                    if($scope.classification!=undefined && $scope.classification.type!=undefined && $scope.classification.length<3){
                                     if(idZawodow!=undefined && $scope.classification.type.name=="Klasyfikacja generalna"){

                                     czyWypelnic = 1;
                                                             $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                            .success(function(data){
                                                             $scope.runners = data;
                                                             if($scope.runners[1] != null)
                                                             {
                                                             $scope.timesColumn = [];
                                                                 for(var a=0;a<=$scope.runners[0].POINTS_COUNT;a++)
                                                                 {
                                                                    if(a<$scope.runners[0].POINTS_COUNT) $scope.timesColumn[a] = a+1;
                                                                    if($scope.runners[a]!=undefined){
                                                                      if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                          {
                                                                          for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                        if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                           {
                                                                              $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                             // console.log($scope.runners[a].KLUB);
                                                                              //console.log(a+" "+b);
                                                                           }
                                                                          }
}}
                                                                 }

                                                                for(var i=($scope.runners.length-1), k=1; i > 0, k<($scope.runners.length); i--, k++)
                                                                 {
                                                                     if($scope.runners[i] != undefined){
                                                                            if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                    $scope.runners[i].MIEJSCE = k;
                                                                                    $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                     for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                                                                     {
                                                                                         var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                         $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                     }
                                                                                  }
                                                                             else {
                                                                             k--;
                                                                             }
                                                                        }
                                                                 }
                                                               //  console.log($scope.runners);
                                                             }
                                        })
                                     .error(function(data,status,headers,config){
                                     $scope.retInfo = 'Błąd!'+ data;
                                  //   console.log('Błąd3!'+ data);
                                     });
                         }
                         }
                         }

                    //klasyfikcja druzynowa
                    $scope.wynikiDruzynowej = function(idZawodow) { czyWypelnic = 1;
                    if($scope.classification!=undefined && $scope.classification.type!=undefined && $scope.classification.length<3){
                    $scope.druzyny = [];

                     if(idZawodow!=undefined && $scope.classification.type.name=="Klasyfikacja generalna drużynowa"){

                     czyWypelnic = 1;
                                     $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                         .success(function(data){
                                                             $scope.runners = data;
                                                             if($scope.runners[1] != null)
                                                             {
                                                             $scope.timesColumn = [];
                                                                 for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                 {
                                                                     $scope.timesColumn[a] = a+1;
                                                                        if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                          {

                                                                          for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                        if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                           {
                                                                              $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                           }
                                                                          }
                                                                        }
                                                                 }
                                                                    var x = $scope.runners[0].POINTS_COUNT;
                                                                   $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');
                                                                for(var i=0; i<($scope.runners.length); i++)
                                                                 {
                                                                     if($scope.runners[i] != undefined){
                                                                            if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                    ileZawodnikow++;
                                                                                    $scope.runners[i].MIEJSCE = i+1;
                                                                                    $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                    $scope.runners[i].TIMES1 = new Array($scope.runners[0].POINTS_COUNT);
                                                                                    for(var j=0; j<$scope.timesColumn.length; j++)
                                                                                     {
                                                                                         var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                         $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                        var b = $scope.runners[i].TIMES[j];
                                                                                        var a = b.split(':');
                                                                                        seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                         $scope.runners[i].TIMES1[j] = seconds;
                                                                                        //$scope.ostatniWynik.push({id: (j+1), id1: k, name:seconds});
                                                                                     }
                                                                                  }
                                                                        }
                                                                 }

                                                                 for(var i=0; i<($scope.runners.length); i++)
                                                                  {
                                                                  if($scope.runners[i].KLUB != undefined){
                                                                if($scope.druzyny.indexOf($scope.runners[i].KLUB)!= -1){
                                                                var index = $scope.druzyny.indexOf($scope.runners[i].KLUB);
                                                               // console.log("index="+index+" klub="+$scope.runners[i].KLUB+"i="+i+"druzy")
                                                                 }
                                                                  else {
                                                                 //  console.log("nie ma"+i+" "+$scope.runners[i].KLUB);
                                                                   $scope.druzyny.push($scope.runners[i].KLUB);
                                                                    $scope.runnersDruz[i] =  $scope.runners[i];

                                                                   }
                                                                }}
                                                              //  console.log($scope.runnersDruz);
                                                             }
                                        })
                                     .error(function(data,status,headers,config){
                                     $scope.retInfo = 'Błąd!'+ data;
                                   //  console.log('Błąd3!'+ data);
                                     });
                         }
                         }
                         }



                        //klasyfikacja punktowa
                        $scope.wynikiPunktowej = function(idZawodow) {

                        czyWypelnic = 1;
                        if($scope.classification!=undefined && $scope.classification.type!=undefined && $scope.classification.length<3){
                         if(idZawodow!=undefined && $scope.classification.type.name=="Klasyfikacja punktowa"){
                        $scope.wyniki1 = [];
                        $scope.ostatniWynik = [];
                        $scope.ostatniWynik1 = [];
                        $scope.tablicaCzasu = [];
                                        $scope.runners = [];

                                        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                         .success(function(data){
                                                             $scope.runners = data;
                                                             if($scope.runners[1] != null)
                                                             {
                                                             $scope.timesColumn = [];
                                                                 for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                 {
                                                                     $scope.timesColumn[a] = a+1;
                                                                        if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                          {

                                                                          for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                        if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                           {
                                                                              $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                           }
                                                                          }
                                                                            }
                                                                 }
                                                                for(var i=($scope.runners.length-1), k=1; i > 0, k<($scope.runners.length); i--, k++)
                                                                 {
                                                                     var seconds = 0;
                                                                     if($scope.runners[i] != undefined){
                                                                            if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                    ileZawodnikow++;
                                                                                    $scope.runners[i].MIEJSCE = k;
                                                                                    $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                    for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                                                                     {
                                                                                         var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                         $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                        var b = $scope.runners[i].TIMES[j];
                                                                                        var a = b.split(':');
                                                                                        seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                        //console.log(seconds);
                                                                                        $scope.ostatniWynik.push({id: (j+1), id1: k, name:seconds});
                                                                                     }

                                                                                  }
                                                                             else {
                                                                             k--;
                                                                             }
                                                                        }

                                                                 }

                                                                    var x = $scope.runners[0].POINTS_COUNT;
                                                                    $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');

                                                           $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                         .success(function(data){
                                                             $scope.response1 = data;
                                                                $scope.listaWynikow1 = [];
                                                            block1: { for(var i=($scope.runners.length-1), v=0;i >= 0,v<=$scope.timesColumn.length;i--,v++){
                                                                var n = 1;
                                                                if($scope.runners[i] != undefined){
                                                                    if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                        $scope.listaWynikow1.push($scope.runners[i].TIMES);
                                                                        //console.log("block1: v="+v+", i="+i);
                                                                    }
                                                                }
                                                                block2: { while (1) {
                                                                if(v==$scope.timesColumn.length) var pointName = 'data.LINIAX_POINT_'+n;
                                                                else var pointName = 'data.LINIA'+v+'_POINT_'+n;
                                                                    $scope.classPoints.push(eval(pointName));
                                                                    n++;
                                                                    if (eval(pointName) != undefined) {
                                                                    //console.log("["+v+","+(n-1)+"]="+eval(pointName));
                                                                    $scope.wyniki1.push({id: v, id1: (n-1), name:eval(pointName)});
                                                                    //console.log($scope.wyniki1);
                                                                    }
                                                                    else break block2;
                                                                }
                                                                }

                                                            }
                                                            }

                                                            for(var j=0;j<=$scope.listaWynikow1.length+1;j++)
                                                                  {
                                                                  if($scope.runners[(j)] != undefined){

                                                                  $scope.runners[j].SUMA = [];
                                                                suma = 0;
                                                            $scope.runners[j].TIMES1 = new Array($scope.runners[0].POINTS_COUNT);
                                                               for(var i=0;i<$scope.timesColumn.length;i++)
                                                                  {
                                                                    var ob = $filter('filter')($scope.wyniki1, {id:(i+1), id1:(j+1)})[0];

                                                                    if(ob != undefined) {
                                                                    suma = parseInt(suma) + parseInt(ob['name']);
                                                                    $scope.runners[(j)].TIMES1[i] = ob['name'];
                                                                    }
                                                                    else {
                                                                    $scope.runners[(j)].TIMES1[i] = "-";
                                                                    }
                                                                  }
                                                                  $scope.runners[(j)].SUMA = suma;
}
                                                            }
                                                      //  console.log($scope.runners);

                                                         })
                                                         .error(function(data,status,headers,config){
                                                             $scope.retInfo = 'Błąd!'+ data;
                                                           //  console.log('Błąd2!'+ data);
                                                         });
                                                             }
                                                    })
                                                 .error(function(data,status,headers,config){
                                                 $scope.retInfo = 'Błąd!'+ data;
                                                 //console.log('Błąd3!'+ data);
                                                 });

                                           }
                                           }
                                }


            $scope.Timer = null;
            $scope.ostatniWynikx = [];
            $scope.idZawodow1 = [];


            $scope.idiX;
            //wynikiOgolne
            $scope.wynikiOgolne = function(idKlasyfikacji) {
            var iter = 0;
            $scope.runners = [];
            $scope.runners1 = [];
            $scope.ostatniWynikx = [];
              if($scope.competition!=undefined && $scope.competition.type!=undefined){
              if($scope.competition.type.name==(cc +". Ogólne")){

              if(czyWypelnic==1 && idKlasyfikacji==undefined){
              $scope.classification.length = 0;
              $scope.classification = [
               {name:'Klasyfikacja generalna' },
               {name:'Klasyfikacja punktowa' },
               {name:'Klasyfikacja generalna drużynowa' }
                                      ];
                                      }
                                      czyWypelnic = 0;

                    if(idKlasyfikacji=="Klasyfikacja generalna"){
                                    $scope.timesColumn.length = 0;
                                        $scope.timesColumn[0] = "META";
                                    $scope.ostatniWynikx1 = [];
                                    $scope.runners2= new Array($scope.types.length-1);
                                    var xd = 0;
                                    for(iter=0; iter<($scope.types.length-1); iter++){
                                    if($scope.classification!=undefined && $scope.classification.type!=undefined){
                                                             //console.log("zacz");
                                                              var myDataPromise = myService.getData($scope.daneEtapow[iter].COMPETITION_ID);
                                                              myDataPromise.then(function(data){
                                                              $scope.runners = data;
                                                                $scope.ostatniWynikx.push($scope.runners);
                                                                xd++;
                                                              });
                                             }
                                    }
                                    $timeout($scope.ogolneOdbierz,1000);
                            }
                     else if (idKlasyfikacji=="Klasyfikacja punktowa"){
                        $scope.timesColumn.length = 0;
                        $scope.idZawPunkt =0;
                        $scope.zawodyKlasyfikacje = [];
                        for(var i = 0; i<$scope.daneEtapow.length;i++) {
                        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[i].COMPETITION_ID)
                                 .success(function(data){
                                  $scope.response11 = data;
                                  $scope.zawodyKlasyfikacje.push($scope.response11);
                        })
                         .error(function(data,status,headers,config){
                          $scope.retInfo = 'Błąd!'+ data;
                        });
                     }
                     $timeout($scope.ogolneOdbierzPunkt,1000);
                   }
                   else if (idKlasyfikacji=="Klasyfikacja generalna drużynowa"){
                        $scope.timesColumn.length = 0;
                        $scope.idZawPunkt =0;
                        $scope.timesColumn[0] = "META";
                        $scope.zawodyKlasyfikacje1 = [];
                        $scope.idiX = 0;
                        for(var i = 0; i<$scope.daneEtapow.length;i++) {

                        $scope.idiX = i;
                        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[i].COMPETITION_ID)
                                 .success(function(data){
                                  $scope.response11 = data;
                                  $scope.zawodyKlasyfikacje1.push($scope.response11);
                        })
                         .error(function(data,status,headers,config){
                          $scope.retInfo = 'Błąd!'+ data;
                        });
                     }
                     $timeout($scope.ogolneOdbierzDruz,1000);
                 }
             }
}
}

$scope.idid;
$scope.ogolneOdbierzPunkt = function() {
    $scope.idid = 0;
    $scope.wyniki1 = [];
    $scope.ostatniWynik = [];
    $scope.ostatniWynik1 = [];
    $scope.tablicaCzasu = [];
    $scope.runners = [];
        for(var id = 0; id<$scope.zawodyKlasyfikacje.length; id++){
         if($scope.zawodyKlasyfikacje[id].TYP=="Klasyfikacja punktowa" && $scope.daneEtapow!=undefined){
                                        $scope.idid = id;
                                        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.zawodyKlasyfikacje[$scope.idid].ID)
                                                         .success(function(data){
                                                             $scope.runners = data;
                                                             if($scope.runners[1] != null){
                                                             $scope.timesColumn = [];

                                                                 for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                 {
                                                                     $scope.timesColumn[a] = a+1;
                                                                        if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                          {

                                                                          for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                        if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                           {
                                                                              $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                           }
                                                                          }
                                                                            }
                                                                 }
                                                                for(var i=($scope.runners.length-1), k=1; i > 0, k<($scope.runners.length); i--, k++)
                                                                 {
                                                                     var seconds = 0;
                                                                     if($scope.runners[i] != undefined){
                                                                            if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                    ileZawodnikow++;
                                                                                    //console.log("1");
                                                                                    $scope.runners[i].MIEJSCE = k;
                                                                                    $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                    for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                                                                     {
                                                                                         var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                         $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                        var b = $scope.runners[i].TIMES[j];
                                                                                        var a = b.split(':');
                                                                                        seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                        //console.log(seconds);
                                                                                        $scope.ostatniWynik.push({id: (j+1), id1: k, name:seconds});
                                                                                     }

                                                                                  }
                                                                             else {
                                                                             k--;
                                                                             }
                                                                        }
                                                                 }
                                                                    var x = $scope.runners[0].POINTS_COUNT;
                                                                    $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');
                                                             $scope.response1 = $scope.zawodyKlasyfikacje[$scope.idid];
                                                           //  console.log($scope.response1);
                                                                $scope.listaWynikow1 = [];
                                                            block1: { for(var i=($scope.runners.length-1), v=0;i >= 0,v<=$scope.timesColumn.length;i--,v++){
                                                                var n = 1;
                                                                if($scope.runners[i] != undefined){
                                                                    if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                        $scope.listaWynikow1.push($scope.runners[i].TIMES);
                                                                    //    console.log($scope.listaWynikow1);
                                                                    }
                                                                }
                                                                block2: { while (1) {
                                                                if(v==$scope.timesColumn.length) var pointName = '$scope.response1.LINIAX_POINT_'+n;
                                                                else var pointName = '$scope.response1.LINIA'+v+'_POINT_'+n;
                                                                    $scope.classPoints.push(eval(pointName));
                                                                    n++;
                                                                    if (eval(pointName) != undefined) {

                                                                    $scope.wyniki1.push({id: v, id1: (n-1), name:eval(pointName)});
                                                                    }
                                                                    else break block2;
                                                                }
                                                                }
                                                            }
                                                            }
                                                            for(var j=0;j<=$scope.listaWynikow1.length+1;j++)
                                                                  {
                                                                  if($scope.runners[(j)] != undefined){

                                                                  $scope.runners[j].SUMA = [];
                                                                suma = 0;
                                                            $scope.runners[j].TIMES1 = new Array($scope.runners[0].POINTS_COUNT);
                                                               for(var i=0;i<$scope.timesColumn.length;i++)
                                                                  {
                                                                    var ob = $filter('filter')($scope.wyniki1, {id:(i+1), id1:(j+1)})[0];
                                                                    if(ob != undefined) {
                                                                    suma = parseInt(suma) + parseInt(ob['name']);
                                                                    //$scope.runners[(j)].TIMES1[i] = ob['name'];
                                                                    }
                                                                    else {
                                                                    //$scope.runners[(j)].TIMES1[i] = "-";
                                                                    }
                                                                  }
                                                                  $scope.runners[(j)].SUMA = suma;
                                                                  $scope.runners[j].TIMES1.length=0;
                                                                 }
                                                            }

                                                      $scope.timesColumn.length = 0;
                                    }
                                    })
                                    .error(function(data,status,headers,config){
                                     $scope.retInfo = 'Błąd!'+ data;
                                     });
                              }
 }
}


$scope.idid1;

$scope.ogolneOdbierzDruz = function(){
 $scope.idid1 = 0;
     $scope.wyniki1 = [];
     $scope.druzyny = [];
     $scope.ostatniWynik = [];
     $scope.ostatniWynik1 = [];
     $scope.runnersDruz = [];
     $scope.tablicaCzasu = [];
     $scope.runners = [];
     //console.log($scope.zawodyKlasyfikacje1);
         for(var id = 0; id<$scope.zawodyKlasyfikacje1.length; id++){
          if($scope.zawodyKlasyfikacje1[id].TYP=="Klasyfikacja generalna drużynowa" && $scope.daneEtapow!=undefined){
                        $scope.idid1 = id;
                   //     console.log($scope.idid1);
                   //     console.log($scope.zawodyKlasyfikacje1[id]);
                        $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.zawodyKlasyfikacje1[$scope.idid1].ID)
                                                         .success(function(data){
                                                             $scope.runners = data;

                                                             if($scope.runners[1] != null)
                                                             {
                                                             $scope.timesColumn = [];
                                                                 for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                 {
                                                                     $scope.timesColumn[a] = a+1;
                                                                        if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                          {

                                                                          for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                        if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                           {
                                                                              $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                           }
                                                                          }
                                                                        }
                                                                 }
                                                                    var x = $scope.runners[0].POINTS_COUNT;
                                                                   $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');
                                                                for(var i=0; i<($scope.runners.length); i++)
                                                                 {
                                                                     if($scope.runners[i] != undefined){
                                                                            if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                    ileZawodnikow++;
                                                                                    $scope.runners[i].MIEJSCE = i+1;
                                                                                    $scope.runners[i].TIMES = new Array(1);
                                                                                    $scope.runners[i].TIMES1 = new Array(1);

                                                                                         var timeName = '$scope.runners[i].POINT'+($scope.timesColumn.length)+'_TIME';
                                                                                         $scope.runners[i].TIMES[0] = eval(timeName).substring(0,8);
                                                                                        var b = $scope.runners[i].TIMES[0];
                                                                                        var a = b.split(':');
                                                                                        seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                         $scope.runners[i].TIMES1[0] = seconds;

                                                                                  }
                                                                        }
                                                                 }

                                                                 for(var i=0; i<($scope.runners.length); i++)
                                                                  {
                                                                  if($scope.runners[i].KLUB != undefined){
                                                                if($scope.druzyny.indexOf($scope.runners[i].KLUB)!= -1){
                                                                var index = $scope.druzyny.indexOf($scope.runners[i].KLUB);

                                                                 }
                                                                  else {
                                                                   $scope.druzyny.push($scope.runners[i].KLUB);
                                                                    $scope.runnersDruz[i] =  $scope.runners[i];

                                                                   }
                                                                }
                                                                }
                                                              //  console.log($scope.runnersDruz);
                                                             }


                                                        $scope.timesColumn.length = 1;
                                                        $scope.timesColumn[0] = "META";


                                        })
                                     .error(function(data,status,headers,config){
                                     $scope.retInfo = 'Błąd!'+ data;
                                   //  console.log('Błąd3!'+ data);
                                     });
          }
          }
}
$scope.ogolneOdbierz = function(){
    var x = null;
    $scope.res = new Array($scope.ostatniWynikx.length);
  //  console.log("ogolne generalne");
    for(var i=0; i<($scope.ostatniWynikx.length); i++){
        x = $scope.ostatniWynikx[i][0].POINTS_COUNT;
        $scope.ostatniWynikx[i] = $filter('orderBy')($scope.ostatniWynikx[i], 'POINT'+x+'_TIME');
        for(var j=0; j<$scope.ostatniWynikx[i].length;j++) {
          if($scope.ostatniWynikx[i][j] != undefined){
                if($scope.ostatniWynikx[i][j].hasOwnProperty('POINT1_TIME')){
                         $scope.ostatniWynikx[i][j].TIMES = new Array(1);
                         var timeName = '$scope.ostatniWynikx[i][j].POINT'+(x)+'_TIME';
                         var b = eval(timeName).substring(0,8);
                         var a = b.split(':');
                         seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                         $scope.ostatniWynikx[i][j].TIMES[0] = seconds;
           }
        }
        }

    }
    for(var i=0; i<($scope.ostatniWynikx.length); i++){
    $scope.ostatniWynikx[i] = $filter('orderBy')($scope.ostatniWynikx[i], 'USER_ID');
    for(var j=0; j<$scope.ostatniWynikx[i].length;j++) {
    if($scope.ostatniWynikx[i][j] != undefined){
                    if($scope.ostatniWynikx[i][j].hasOwnProperty('POINT1_TIME')){
                         if(i>0){
                            $scope.ostatniWynikx[i][j].TIMES[0] = $scope.ostatniWynikx[i][j].TIMES[0] + $scope.ostatniWynikx[(i-1)][j].TIMES[0];
                         }
                         if(i==($scope.ostatniWynikx.length-1)){
                         var s = $scope.ostatniWynikx[i][j].TIMES[0];
                        $scope.ostatniWynikx[i][j].TIMES[0] = msToTime(s);
                         $scope.ostatniWynikx[i][j].MIEJSCE = i+1;
                         }
                          if($scope.ostatniWynikx[i][j].hasOwnProperty('NAZWISKO'))
                         {
                               for(var b=0; b<$scope.zawodnicy.length; b++){
                                if($scope.ostatniWynikx[i][j].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                      {
                                      $scope.ostatniWynikx[i][j].KLUB = $scope.zawodnicy[b].KLUB;
                                      }
                                    }
                               }
                         }
                    }
            }
    }
    $scope.ostatniWynikx[($scope.ostatniWynikx.length-1)] = $filter('orderBy')($scope.ostatniWynikx[($scope.ostatniWynikx.length-1)], 'TIMES');
    $scope.runners = $scope.ostatniWynikx[($scope.ostatniWynikx.length-1)];
    $scope.ostatniWynikx = [];
}





function msToTime(duration) {
    var  seconds = parseInt((duration)%60)
        , minutes = parseInt((duration/(60))%60)
        , hours = parseInt((duration/(60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;

}


                    $scope.showRunnersList = function(){
                            sessionStorage.setItem('compID', id);
                            $location.path('/Multi/home/competition/compRunnersList');

                        }

                    $scope.showDescription = function(){
                            sessionStorage.setItem('compID', id);
                            $location.path('/Multi/home/competition');

                        }
                          $scope.showStage = function(){
                         sessionStorage.setItem('compID1', id);
                         $location.path('/Multi/home/competitions/stages');
                         }


    }])
app.service("PromiseUtils", function($q) {
       return {
           getPromiseHttpResult: function (httpPromise) {
               var deferred = $q.defer();
               httpPromise.success(function (data) {
                   deferred.resolve(data);
               }).error(function () {
                   deferred.reject(arguments);
               });
               return deferred.promise;
           }
       }
   })
app.controller('myResultListController', ['$scope','$timeout', '$filter','$http', '$route', '$sessionStorage', '$log','$location', function($scope,$timeout, $filter, $http, $route, $sessionStorage, $log, $location){

             var id = sessionStorage.getItem('compID');
             var user_id = sessionStorage.getItem('ID');
             $scope.editActive = sessionStorage.getItem('editActive');
             $scope.hasStage = sessionStorage.getItem('stage');
                   $scope.runners = [];
                                 $scope.runnersDruz = [];
                                 $scope.runners1 = [];
                                 $scope.zawodnicy = [];
                                 $scope.runners1 = [];
                                 $scope.classPoints = [];
                                 $scope.classPoints1 = [];
                                  $scope.runners2 = [];
                                 $scope.wyniki = [];
                                 $scope.wynikii = [];
                                 $scope.wyniki1 = [];
                                 $scope.wynikiTimes = [];
                                 $scope.timesColumn = [];
                                 var zawody = new Array();
                                 $scope.wynikOgolnych = [];
                                 var czyWypelnic = 0;
                                 $scope.idZawPunkt = 0;
                                 $scope.zawodyKlasyfikacje = [];
                                 $scope.zawodyKlasyfikacje1 = [];

             $scope.listaWynikow1 = [];
             var suma = 0;
                         $scope.daneEtapow = [];
                         var info = "";
                         $scope.infoWielo = "";
                         var m = 1;
                         var n = 0;
                         var cc;
             var ileZawodnikow = 0;
                         $scope.types = [];
                         $scope.classification = [
                                        {name:'Klasyfikacja generalna' },
                                        {name:'Klasyfikacja punktowa' },
                                        {name:'Klasyfikacja generalna drużynowa' }
                                                               ];
                                     var xd=0;
             $scope.retInfo = '';
             $scope.banned=[];
             $scope.runners = [];
             $scope.x = sessionStorage.getItem('wielo');
             $scope.name = sessionStorage.getItem('name');

             $scope.init = function() {
                             $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition?id=' + id)
                             .success(function(data1){
                              info = data1;
                              $scope.infoWielo = data1.WIELOETAPOWE;
                              if($scope.infoWielo==1){
                                          $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/all?type=&name=&place=&wieloetapowe=' + id)
                                              .success(function(data){
                                              $scope.daneEtapow = data;
                                              $scope.wypelnijEtapy();
                                                 })
                                             .error(function(data,status,headers,config){
                                              $scope.retInfo = 'Błąd!'+ data;
                                              // console.log('Błąd1!'+ data);
                                               });
                              }
                             else if($scope.infoWielo==0){
                                 $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+id)
                                 .success(function(data){
                                     $scope.runners = data;
                                     if($scope.runners[1] != null)
                                     {
                                         $scope.timesColumn = [];
                                         for(var i=0;i<$scope.runners[0].POINTS_COUNT;i++)
                                         {
                                             $scope.timesColumn[i] = i+1;
                                         }
                                         for(var i=1; i < $scope.runners.length; i++)
                                         {
                                             $scope.runners[i].MIEJSCE = i;

                                             $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                             for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                             {
                                                 var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                 $scope.runners[i].TIMES[j] = eval(timeName);
                                             }
                                         }
                                     }
                                 })
                                 .error(function(data,status,headers,config){
                                     $scope.retInfo = 'Błąd!'+ data;
                                 });
                             }
                          })
                             .error(function(data1,status,headers,config){
                             $scope.retInfo = 'Błąd!'+ data1;
                             });

                             $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/event/list?competition_id=' + id + '&sex=&age=&phrase=&category=')
                                                 .success(function(data){
                                                     $scope.zawodnicy = data;
                                                 })

                                                 .error(function(data,status,headers,config){
                                                     $scope.retInfo = 'Błąd!'+ data;
                                                 });
                         }

                    //wypelnijKlasyfikacje
                                                           $scope.wypelnijKlasyfikacje = function(idZawodow) {
                                                                if($scope.daneEtapow[idZawodow] != undefined && $scope.competition.type.name!=(cc +". Ogólne")){
                                                                $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                                             .success(function(data){
                                                                                                $scope.classification.length=0;
                                                                                                $scope.classification = [
                                                                                                                {name:'Klasyfikacja generalna' }
                                                                                                                       ];
                                                                            // $scope.classification[1] = [name:'Klasyfikacja generalna']
                                                                             if(data.TYP != 'Klasyfikacja generalna') $scope.classification[1] = {name:data.TYP};
                                                                            else $scope.classification.length=1;
                                                                             })
                                                                             .error(function(data,status,headers,config){
                                                                                                                  $scope.retInfo = 'Błąd!'+ data;
                                                                                                             //     console.log('Błąd3!'+ data);
                                                                                                                  });
                                                                                            }
                                                                                            }

                                                          $scope.wypelnijEtapy = function() {
                                                                                for(var dd =0; dd<$scope.daneEtapow.length; dd++)
                                                                                 {
                                                                                              $scope.types[dd]={id: dd, name:dd+1 +". " + $scope.daneEtapow[dd].NAME + " - " + $scope.daneEtapow[dd].DATA_ROZP};
                                                                                 }
                                                                                  cc = dd+1;
                                                                                  $scope.types[dd]={name:cc +". Ogólne"};
                                                                     }
   //klasyfikacja generalna
                                     $scope.wynikiGeneralnej = function(idZawodow) { czyWypelnic = 1;
                                     if($scope.classification!=undefined && $scope.classification.type!=undefined && $scope.classification.length<3){
                                      if(idZawodow!=undefined && $scope.classification.type.name=="Klasyfikacja generalna"){

                                      czyWypelnic = 1;
                                                              $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                             .success(function(data){
                                                              $scope.runners = data;
                                                              if($scope.runners[1] != null)
                                                              {
                                                              $scope.timesColumn = [];
                                                                  for(var a=0;a<=$scope.runners[0].POINTS_COUNT;a++)
                                                                  {
                                                                     if(a<$scope.runners[0].POINTS_COUNT) $scope.timesColumn[a] = a+1;
                                                                     if($scope.runners[a]!=undefined){
                                                                       if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                           {
                                                                           for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                         if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                            {
                                                                               $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                              // console.log($scope.runners[a].KLUB);
                                                                               //console.log(a+" "+b);
                                                                            }
                                                                           }
 }}
                                                                  }

                                                                 for(var i=($scope.runners.length-1), k=1; i > 0, k<($scope.runners.length); i--, k++)
                                                                  {
                                                                      if($scope.runners[i] != undefined){
                                                                             if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                     $scope.runners[i].MIEJSCE = k;
                                                                                     $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                      for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                                                                      {
                                                                                          var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                          $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                      }
                                                                                   }
                                                                              else {
                                                                              k--;
                                                                              }
                                                                         }
                                                                  }
                                                                //  console.log($scope.runners);
                                                              }
                                         })
                                      .error(function(data,status,headers,config){
                                      $scope.retInfo = 'Błąd!'+ data;
                                   //   console.log('Błąd3!'+ data);
                                      });
                          }
                          }
                          }

                     //klasyfikcja druzynowa
                     $scope.wynikiDruzynowej = function(idZawodow) { czyWypelnic = 1;
                     if($scope.classification!=undefined && $scope.classification.type!=undefined && $scope.classification.length<3){
                     $scope.druzyny = [];

                      if(idZawodow!=undefined && $scope.classification.type.name=="Klasyfikacja generalna drużynowa"){

                      czyWypelnic = 1;
                                      $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                          .success(function(data){
                                                              $scope.runners = data;
                                                              if($scope.runners[1] != null)
                                                              {
                                                              $scope.timesColumn = [];
                                                                  for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                  {
                                                                      $scope.timesColumn[a] = a+1;
                                                                         if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                           {

                                                                           for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                         if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                            {
                                                                               $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                            }
                                                                           }
                                                                         }
                                                                  }
                                                                     var x = $scope.runners[0].POINTS_COUNT;
                                                                    $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');
                                                                 for(var i=0; i<($scope.runners.length); i++)
                                                                  {
                                                                      if($scope.runners[i] != undefined){
                                                                             if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                     ileZawodnikow++;
                                                                                     $scope.runners[i].MIEJSCE = i+1;
                                                                                     $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                     $scope.runners[i].TIMES1 = new Array($scope.runners[0].POINTS_COUNT);
                                                                                     for(var j=0; j<$scope.timesColumn.length; j++)
                                                                                      {
                                                                                          var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                          $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                         var b = $scope.runners[i].TIMES[j];
                                                                                         var a = b.split(':');
                                                                                         seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                          $scope.runners[i].TIMES1[j] = seconds;
                                                                                         //$scope.ostatniWynik.push({id: (j+1), id1: k, name:seconds});
                                                                                      }
                                                                                   }
                                                                         }
                                                                  }

                                                                  for(var i=0; i<($scope.runners.length); i++)
                                                                   {
                                                                   if($scope.runners[i].KLUB != undefined){
                                                                 if($scope.druzyny.indexOf($scope.runners[i].KLUB)!= -1){
                                                                 var index = $scope.druzyny.indexOf($scope.runners[i].KLUB);
                                                                // console.log("index="+index+" klub="+$scope.runners[i].KLUB+"i="+i+"druzy")
                                                                  }
                                                                   else {
                                                                  //  console.log("nie ma"+i+" "+$scope.runners[i].KLUB);
                                                                    $scope.druzyny.push($scope.runners[i].KLUB);
                                                                     $scope.runnersDruz[i] =  $scope.runners[i];

                                                                    }
                                                                 }}
                                                               //  console.log($scope.runnersDruz);
                                                              }
                                         })
                                      .error(function(data,status,headers,config){
                                      $scope.retInfo = 'Błąd!'+ data;
                                    //  console.log('Błąd3!'+ data);
                                      });
                          }
                          }
                          }



                         //klasyfikacja punktowa
                         $scope.wynikiPunktowej = function(idZawodow) {

                         czyWypelnic = 1;
                         if($scope.classification!=undefined && $scope.classification.type!=undefined && $scope.classification.length<3){
                          if(idZawodow!=undefined && $scope.classification.type.name=="Klasyfikacja punktowa"){
                         $scope.wyniki1 = [];
                         $scope.ostatniWynik = [];
                         $scope.ostatniWynik1 = [];
                         $scope.tablicaCzasu = [];
                                         $scope.runners = [];

                                         $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                          .success(function(data){
                                                              $scope.runners = data;
                                                              if($scope.runners[1] != null)
                                                              {
                                                              $scope.timesColumn = [];
                                                                  for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                  {
                                                                      $scope.timesColumn[a] = a+1;
                                                                         if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                           {

                                                                           for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                         if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                            {
                                                                               $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                            }
                                                                           }
                                                                             }
                                                                  }
                                                                 for(var i=($scope.runners.length-1), k=1; i > 0, k<($scope.runners.length); i--, k++)
                                                                  {
                                                                      var seconds = 0;
                                                                      if($scope.runners[i] != undefined){
                                                                             if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                     ileZawodnikow++;
                                                                                     $scope.runners[i].MIEJSCE = k;
                                                                                     $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                     for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                                                                      {
                                                                                          var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                          $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                         var b = $scope.runners[i].TIMES[j];
                                                                                         var a = b.split(':');
                                                                                         seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                         //console.log(seconds);
                                                                                         $scope.ostatniWynik.push({id: (j+1), id1: k, name:seconds});
                                                                                      }

                                                                                   }
                                                                              else {
                                                                              k--;
                                                                              }
                                                                         }

                                                                  }

                                                                     var x = $scope.runners[0].POINTS_COUNT;
                                                                     $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');

                                                            $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[idZawodow].COMPETITION_ID)
                                                          .success(function(data){
                                                              $scope.response1 = data;
                                                                 $scope.listaWynikow1 = [];
                                                             block1: { for(var i=($scope.runners.length-1), v=0;i >= 0,v<=$scope.timesColumn.length;i--,v++){
                                                                 var n = 1;
                                                                 if($scope.runners[i] != undefined){
                                                                     if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                         $scope.listaWynikow1.push($scope.runners[i].TIMES);
                                                                         //console.log("block1: v="+v+", i="+i);
                                                                     }
                                                                 }
                                                                 block2: { while (1) {
                                                                 if(v==$scope.timesColumn.length) var pointName = 'data.LINIAX_POINT_'+n;
                                                                 else var pointName = 'data.LINIA'+v+'_POINT_'+n;
                                                                     $scope.classPoints.push(eval(pointName));
                                                                     n++;
                                                                     if (eval(pointName) != undefined) {
                                                                     //console.log("["+v+","+(n-1)+"]="+eval(pointName));
                                                                     $scope.wyniki1.push({id: v, id1: (n-1), name:eval(pointName)});
                                                                     //console.log($scope.wyniki1);
                                                                     }
                                                                     else break block2;
                                                                 }
                                                                 }

                                                             }
                                                             }

                                                             for(var j=0;j<=$scope.listaWynikow1.length+1;j++)
                                                                   {
                                                                   if($scope.runners[(j)] != undefined){

                                                                   $scope.runners[j].SUMA = [];
                                                                 suma = 0;
                                                             $scope.runners[j].TIMES1 = new Array($scope.runners[0].POINTS_COUNT);
                                                                for(var i=0;i<$scope.timesColumn.length;i++)
                                                                   {
                                                                     var ob = $filter('filter')($scope.wyniki1, {id:(i+1), id1:(j+1)})[0];

                                                                     if(ob != undefined) {
                                                                     suma = parseInt(suma) + parseInt(ob['name']);
                                                                     $scope.runners[(j)].TIMES1[i] = ob['name'];
                                                                     }
                                                                     else {
                                                                     $scope.runners[(j)].TIMES1[i] = "-";
                                                                     }
                                                                   }
                                                                   $scope.runners[(j)].SUMA = suma;
 }
                                                             }
                                                       //  console.log($scope.runners);

                                                          })
                                                          .error(function(data,status,headers,config){
                                                              $scope.retInfo = 'Błąd!'+ data;
                                                            //  console.log('Błąd2!'+ data);
                                                          });
                                                              }
                                                     })
                                                  .error(function(data,status,headers,config){
                                                  $scope.retInfo = 'Błąd!'+ data;
                                                  //console.log('Błąd3!'+ data);
                                                  });

                                            }
                                            }
                                 }


             $scope.Timer = null;
             $scope.ostatniWynikx = [];
             $scope.idZawodow1 = [];


             $scope.idiX;
             //wynikiOgolne
             $scope.wynikiOgolne = function(idKlasyfikacji) {
             var iter = 0;
             $scope.runners = [];
             $scope.runners1 = [];
             $scope.ostatniWynikx = [];
               if($scope.competition!=undefined && $scope.competition.type!=undefined){
               if($scope.competition.type.name==(cc +". Ogólne")){

               if(czyWypelnic==1 && idKlasyfikacji==undefined){
               $scope.classification.length = 0;
               $scope.classification = [
                {name:'Klasyfikacja generalna' },
                {name:'Klasyfikacja punktowa' },
                {name:'Klasyfikacja generalna drużynowa' }
                                       ];
                                       }
                                       czyWypelnic = 0;

                     if(idKlasyfikacji=="Klasyfikacja generalna"){
                                     $scope.timesColumn.length = 0;
                                         $scope.timesColumn[0] = "META";
                                     $scope.ostatniWynikx1 = [];
                                     $scope.runners2= new Array($scope.types.length-1);
                                     var xd = 0;
                                     for(iter=0; iter<($scope.types.length-1); iter++){
                                     if($scope.classification!=undefined && $scope.classification.type!=undefined){
                                                          $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.daneEtapow[iter].COMPETITION_ID)
                                                            .success(function(data){
                                                               $scope.runners = data;
                                                                 $scope.ostatniWynikx.push($scope.runners);
                                                               })
                                                           .error(function(data,status,headers,config){
                                                            $scope.retInfo = 'Błąd!'+ data;
                                                   });
                                              }
                                     }
                                     $timeout($scope.ogolneOdbierz,1000);
                             }
                      else if (idKlasyfikacji=="Klasyfikacja punktowa"){
                         $scope.timesColumn.length = 0;
                         $scope.idZawPunkt =0;
                         $scope.zawodyKlasyfikacje = [];
                         for(var i = 0; i<$scope.daneEtapow.length;i++) {
                         $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[i].COMPETITION_ID)
                                  .success(function(data){
                                   $scope.response11 = data;
                                   $scope.zawodyKlasyfikacje.push($scope.response11);
                         })
                          .error(function(data,status,headers,config){
                           $scope.retInfo = 'Błąd!'+ data;
                         });
                      }
                      $timeout($scope.ogolneOdbierzPunkt,1000);
                    }
                    else if (idKlasyfikacji=="Klasyfikacja generalna drużynowa"){
                         $scope.timesColumn.length = 0;
                         $scope.idZawPunkt =0;
                         $scope.timesColumn[0] = "META";
                         $scope.zawodyKlasyfikacje1 = [];
                         $scope.idiX = 0;
                         for(var i = 0; i<$scope.daneEtapow.length;i++) {

                         $scope.idiX = i;
                         $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/competition/classification?competition_id='+$scope.daneEtapow[i].COMPETITION_ID)
                                  .success(function(data){
                                   $scope.response11 = data;
                                   $scope.zawodyKlasyfikacje1.push($scope.response11);
                         })
                          .error(function(data,status,headers,config){
                           $scope.retInfo = 'Błąd!'+ data;
                         });
                      }
                      $timeout($scope.ogolneOdbierzDruz,1000);
                  }
              }
 }
 }

 $scope.idid;
 $scope.ogolneOdbierzPunkt = function() {
     $scope.idid = 0;
     $scope.wyniki1 = [];
     $scope.ostatniWynik = [];
     $scope.ostatniWynik1 = [];
     $scope.tablicaCzasu = [];
     $scope.runners = [];
         for(var id = 0; id<$scope.zawodyKlasyfikacje.length; id++){
          if($scope.zawodyKlasyfikacje[id].TYP=="Klasyfikacja punktowa" && $scope.daneEtapow!=undefined){
                                         $scope.idid = id;
                                         $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.zawodyKlasyfikacje[$scope.idid].ID)
                                                          .success(function(data){
                                                              $scope.runners = data;
                                                              if($scope.runners[1] != null){
                                                              $scope.timesColumn = [];

                                                                  for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                  {
                                                                      $scope.timesColumn[a] = a+1;
                                                                         if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                           {

                                                                           for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                         if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                            {
                                                                               $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                            }
                                                                           }
                                                                             }
                                                                  }
                                                                 for(var i=($scope.runners.length-1), k=1; i > 0, k<($scope.runners.length); i--, k++)
                                                                  {
                                                                      var seconds = 0;
                                                                      if($scope.runners[i] != undefined){
                                                                             if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                     ileZawodnikow++;
                                                                                     //console.log("1");
                                                                                     $scope.runners[i].MIEJSCE = k;
                                                                                     $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
                                                                                     for(var j=0; j<$scope.runners[0].POINTS_COUNT; j++)
                                                                                      {
                                                                                          var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
                                                                                          $scope.runners[i].TIMES[j] = eval(timeName).substring(0,8);
                                                                                         var b = $scope.runners[i].TIMES[j];
                                                                                         var a = b.split(':');
                                                                                         seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                         //console.log(seconds);
                                                                                         $scope.ostatniWynik.push({id: (j+1), id1: k, name:seconds});
                                                                                      }

                                                                                   }
                                                                              else {
                                                                              k--;
                                                                              }
                                                                         }
                                                                  }
                                                                     var x = $scope.runners[0].POINTS_COUNT;
                                                                     $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');
                                                              $scope.response1 = $scope.zawodyKlasyfikacje[$scope.idid];
                                                            //  console.log($scope.response1);
                                                                 $scope.listaWynikow1 = [];
                                                             block1: { for(var i=($scope.runners.length-1), v=0;i >= 0,v<=$scope.timesColumn.length;i--,v++){
                                                                 var n = 1;
                                                                 if($scope.runners[i] != undefined){
                                                                     if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                         $scope.listaWynikow1.push($scope.runners[i].TIMES);
                                                                     //    console.log($scope.listaWynikow1);
                                                                     }
                                                                 }
                                                                 block2: { while (1) {
                                                                 if(v==$scope.timesColumn.length) var pointName = '$scope.response1.LINIAX_POINT_'+n;
                                                                 else var pointName = '$scope.response1.LINIA'+v+'_POINT_'+n;
                                                                     $scope.classPoints.push(eval(pointName));
                                                                     n++;
                                                                     if (eval(pointName) != undefined) {

                                                                     $scope.wyniki1.push({id: v, id1: (n-1), name:eval(pointName)});
                                                                     }
                                                                     else break block2;
                                                                 }
                                                                 }
                                                             }
                                                             }
                                                             for(var j=0;j<=$scope.listaWynikow1.length+1;j++)
                                                                   {
                                                                   if($scope.runners[(j)] != undefined){

                                                                   $scope.runners[j].SUMA = [];
                                                                 suma = 0;
                                                             $scope.runners[j].TIMES1 = new Array($scope.runners[0].POINTS_COUNT);
                                                                for(var i=0;i<$scope.timesColumn.length;i++)
                                                                   {
                                                                     var ob = $filter('filter')($scope.wyniki1, {id:(i+1), id1:(j+1)})[0];
                                                                     if(ob != undefined) {
                                                                     suma = parseInt(suma) + parseInt(ob['name']);
                                                                     //$scope.runners[(j)].TIMES1[i] = ob['name'];
                                                                     }
                                                                     else {
                                                                     //$scope.runners[(j)].TIMES1[i] = "-";
                                                                     }
                                                                   }
                                                                   $scope.runners[(j)].SUMA = suma;
                                                                   $scope.runners[j].TIMES1.length=0;
                                                                  }
                                                             }

                                                       $scope.timesColumn.length = 0;
                                     }
                                     })
                                     .error(function(data,status,headers,config){
                                      $scope.retInfo = 'Błąd!'+ data;
                                      });
                               }
  }
 }


 $scope.idid1;

 $scope.ogolneOdbierzDruz = function(){
  $scope.idid1 = 0;
      $scope.wyniki1 = [];
      $scope.druzyny = [];
      $scope.ostatniWynik = [];
      $scope.ostatniWynik1 = [];
      $scope.runnersDruz = [];
      $scope.tablicaCzasu = [];
      $scope.runners = [];
      //console.log($scope.zawodyKlasyfikacje1);
          for(var id = 0; id<$scope.zawodyKlasyfikacje1.length; id++){
           if($scope.zawodyKlasyfikacje1[id].TYP=="Klasyfikacja generalna drużynowa" && $scope.daneEtapow!=undefined){
                         $scope.idid1 = id;
                    //     console.log($scope.idid1);
                    //     console.log($scope.zawodyKlasyfikacje1[id]);
                         $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+$scope.zawodyKlasyfikacje1[$scope.idid1].ID)
                                                          .success(function(data){
                                                              $scope.runners = data;

                                                              if($scope.runners[1] != null)
                                                              {
                                                              $scope.timesColumn = [];
                                                                  for(var a=0;a<$scope.runners[0].POINTS_COUNT;a++)
                                                                  {
                                                                      $scope.timesColumn[a] = a+1;
                                                                         if($scope.runners[a].hasOwnProperty('NAZWISKO'))
                                                                           {

                                                                           for(var b=0; b<$scope.zawodnicy.length; b++){
                                                                         if($scope.runners[a].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                                                            {
                                                                               $scope.runners[a].KLUB = $scope.zawodnicy[b].KLUB;
                                                                            }
                                                                           }
                                                                         }
                                                                  }
                                                                     var x = $scope.runners[0].POINTS_COUNT;
                                                                    $scope.runners = $filter('orderBy')($scope.runners, 'POINT'+x+'_TIME');
                                                                 for(var i=0; i<($scope.runners.length); i++)
                                                                  {
                                                                      if($scope.runners[i] != undefined){
                                                                             if($scope.runners[i].hasOwnProperty('POINT1_TIME')){
                                                                                     ileZawodnikow++;
                                                                                     $scope.runners[i].MIEJSCE = i+1;
                                                                                     $scope.runners[i].TIMES = new Array(1);
                                                                                     $scope.runners[i].TIMES1 = new Array(1);

                                                                                          var timeName = '$scope.runners[i].POINT'+($scope.timesColumn.length)+'_TIME';
                                                                                          $scope.runners[i].TIMES[0] = eval(timeName).substring(0,8);
                                                                                         var b = $scope.runners[i].TIMES[0];
                                                                                         var a = b.split(':');
                                                                                         seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                                                                                          $scope.runners[i].TIMES1[0] = seconds;

                                                                                   }
                                                                         }
                                                                  }

                                                                  for(var i=0; i<($scope.runners.length); i++)
                                                                   {
                                                                   if($scope.runners[i].KLUB != undefined){
                                                                 if($scope.druzyny.indexOf($scope.runners[i].KLUB)!= -1){
                                                                 var index = $scope.druzyny.indexOf($scope.runners[i].KLUB);

                                                                  }
                                                                   else {
                                                                    $scope.druzyny.push($scope.runners[i].KLUB);
                                                                     $scope.runnersDruz[i] =  $scope.runners[i];

                                                                    }
                                                                 }
                                                                 }
                                                               //  console.log($scope.runnersDruz);
                                                              }


                                                         $scope.timesColumn.length = 1;
                                                         $scope.timesColumn[0] = "META";


                                         })
                                      .error(function(data,status,headers,config){
                                      $scope.retInfo = 'Błąd!'+ data;
                                    //  console.log('Błąd3!'+ data);
                                      });
           }
           }
 }
 $scope.ogolneOdbierz = function(){
     var x = null;
     $scope.res = new Array($scope.ostatniWynikx.length);
   //  console.log("ogolne generalne");
     for(var i=0; i<($scope.ostatniWynikx.length); i++){
         x = $scope.ostatniWynikx[i][0].POINTS_COUNT;
         $scope.ostatniWynikx[i] = $filter('orderBy')($scope.ostatniWynikx[i], 'POINT'+x+'_TIME');
         for(var j=0; j<$scope.ostatniWynikx[i].length;j++) {
           if($scope.ostatniWynikx[i][j] != undefined){
                 if($scope.ostatniWynikx[i][j].hasOwnProperty('POINT1_TIME')){
                          $scope.ostatniWynikx[i][j].TIMES = new Array(1);
                          var timeName = '$scope.ostatniWynikx[i][j].POINT'+(x)+'_TIME';
                          var b = eval(timeName).substring(0,8);
                          var a = b.split(':');
                          seconds = (+a[0])*60*60+(+a[1])*60+(+a[2]);
                          $scope.ostatniWynikx[i][j].TIMES[0] = seconds;
            }
         }
         }

     }
     for(var i=0; i<($scope.ostatniWynikx.length); i++){
     $scope.ostatniWynikx[i] = $filter('orderBy')($scope.ostatniWynikx[i], 'USER_ID');
     for(var j=0; j<$scope.ostatniWynikx[i].length;j++) {
     if($scope.ostatniWynikx[i][j] != undefined){
                     if($scope.ostatniWynikx[i][j].hasOwnProperty('POINT1_TIME')){
                          if(i>0){
                             $scope.ostatniWynikx[i][j].TIMES[0] = $scope.ostatniWynikx[i][j].TIMES[0] + $scope.ostatniWynikx[(i-1)][j].TIMES[0];
                          }
                          if(i==($scope.ostatniWynikx.length-1)){
                          var s = $scope.ostatniWynikx[i][j].TIMES[0];
                         $scope.ostatniWynikx[i][j].TIMES[0] = msToTime(s);
                          $scope.ostatniWynikx[i][j].MIEJSCE = i+1;
                          }
                           if($scope.ostatniWynikx[i][j].hasOwnProperty('NAZWISKO'))
                          {
                                for(var b=0; b<$scope.zawodnicy.length; b++){
                                 if($scope.ostatniWynikx[i][j].NAZWISKO == $scope.zawodnicy[b].NAZWISKO)
                                       {
                                       $scope.ostatniWynikx[i][j].KLUB = $scope.zawodnicy[b].KLUB;
                                       }
                                     }
                                }
                          }
                     }
             }
     }
     $scope.ostatniWynikx[($scope.ostatniWynikx.length-1)] = $filter('orderBy')($scope.ostatniWynikx[($scope.ostatniWynikx.length-1)], 'TIMES');
     $scope.runners = $scope.ostatniWynikx[($scope.ostatniWynikx.length-1)];
     $scope.ostatniWynikx = [];
 }





 function msToTime(duration) {
     var  seconds = parseInt((duration)%60)
         , minutes = parseInt((duration/(60))%60)
         , hours = parseInt((duration/(60*60))%24);

     hours = (hours < 10) ? "0" + hours : hours;
     minutes = (minutes < 10) ? "0" + minutes : minutes;
     seconds = (seconds < 10) ? "0" + seconds : seconds;

     return hours + ":" + minutes + ":" + seconds;

 }

//                    $http.get('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/list?competition_id='+id)
//                    .success(function(data){
//                        $scope.runners = data;
//                        if($scope.runners[1] != null){
//                            $scope.details = $scope.runners[0];
//                            $scope.runners.shift();
//
//                            if($scope.runners[0] != null)
//                            {
//                                $scope.timesColumn = [];
//
//                                for(var i=0;i<$scope.details.POINTS_COUNT;i++)
//                                {
//                                    $scope.timesColumn[i] = i+1;
//                                }
//
//                                for(var i=0; i < $scope.runners.length; i++)
//                                {
//
//                                    $scope.runners[i].TIMES = new Array($scope.runners[0].POINTS_COUNT);
//                                    for(var j=0; j<$scope.details.POINTS_COUNT; j++)
//                                    {
//                                        var timeName = '$scope.runners[i].POINT'+(j+1)+'_TIME';
//                                        $scope.runners[i].TIMES[j] = eval(timeName);
//                                    }
//                                }
//                            }
//                        }
//
//                    })
//
//                    .error(function(data,status,headers,config){
//                        $scope.retInfo = 'Błąd!'+ data;
//                    });


                    $scope.DSQ = function(i){
                        if (confirm('Czy chcesz zdyskfalifikować tego zawodnika?')) {
                        $scope.runners[i].DSQ  = true;
                        $scope.banned.push($scope.runners[i]);
                        $scope.runners.splice(i, 1);

                        }
                    }

                    $scope.confirmResultList = function(){
                        var lastResult=[]
                        var lastBanned=[]

                    for(var i=0; i<$scope.runners.length;i++){
                        if(i!=0){
                        lastResult[i] =$scope.runners[i].EVENT_ID;
                        }
                        else{
                            lastResult[i] =$scope.runners[i].EVENT_ID;
                        }
                    }


                    for(var i=0; i<$scope.banned.length;i++){
                        if(i!=0){
                        lastBanned[i] = $scope.banned[i].EVENT_ID;
                        }
                        else{
                            lastBanned[i] = $scope.banned[i].EVENT_ID;
                        }
                    }


                    $http.put('http://209785serwer.iiar.pwr.edu.pl/Rest1/rest/result/publish?user_id='+user_id+
                                                                                                '&competition_id=' + id +
                                                                                                '&parts='+ lastResult.toString()+
                                                                                                '&banned='+ lastBanned.toString())
                    .success(function(data){
                        $scope.retInfo = "Zawody zostały opublikowane";
                        $route.reload();
                    })
                    .error(function(data,status,headers,config){
                        $scope.retInfo = 'Błąd!'+ data;
                    });

                    }

                    $scope.showRunnersList = function(){
                            sessionStorage.setItem('compID', id);
                            $location.path('/Multi/home/myCompetition/runnersList');

                        }

                    $scope.showDescription = function(){
                            sessionStorage.setItem('compID', id);
                            $location.path('/Multi/home/myCompetition');

                        }

                    $scope.editCompetition = function(){
                            sessionStorage.setItem('compID', id);
                            $location.path('/Multi/home/myCompetition/edit');

                        }
                    $scope.makeStage = function(){
                    sessionStorage.setItem('name', $scope.name);
                     //sessionStorage.setItem('compName', $scope.competition.NAME);
                   $location.path('/Multi/home/myCompetition/stage');
}
                   $scope.showStage = function(){
                    sessionStorage.setItem('compID1', id);
                    sessionStorage.removeItem('name');
                     $location.path('/Multi/home/myCompetitions/myStages');
                      }



    }])

})();
