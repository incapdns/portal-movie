var videoBtn = function() {
	$('#modal').show()
	
	let width = $('.modal-body').width()
	
	let videoSrc = $(this).data("src") + '?width=' + parseInt(width)
	
	$("#video").attr('src', videoSrc);
}

let key = '483ad82b6b8026a6659a76eb8044f029';

var titleBtn = function() {
	let id = $(this).data("id")

	$.get('https://api.themoviedb.org/3/find/'+id+'?api_key='+key+'&language=pt-BR&external_source=imdb_id', (data) => {
		Object.keys(data).forEach(key => {
			if(data[key].length){
				let item = data[key][0];
				let type = key.includes('tv') ? 'tv' : (key.includes('person') ? 'person' : 'movie');
				window.location.href = 'https://www.themoviedb.org/'+type+'/'+item.id+'?language=pt-BR';
			}
		})
	})
}

$(document).ready(function() {
    $('.video-btn').click(videoBtn);

    $('#modal').on('hide.bs.modal', function(e) {
        $("#video").removeAttr('src')
    })
});

//Falso, pois está usando TImdbAPI !
if(window.useImdbAPI){
	function SetToken(token){
		$.ajaxSetup({
		  beforeSend: function(jqXHR, settings) {
			if(settings.url.includes('imdb.com'))
				settings.url = 'https://cors.bridged.cc/' + settings.url;
		  },
		  contentType: 'application/json',
		  dataType: 'json',
		  headers: {
			'x-amzn-sessionid': token,
			'x-imdb-client-name': 'imdb-web-next',
			'x-imdb-user-country': 'BR',
			'x-imdb-user-language': 'pt-BR',
		  }
		})
	}

	let data = '{\"query\":\"fragment BaseTitleCard on Title {\\n  id\\n  titleText {\\n    text\\n    __typename\\n  }\\n  titleType {\\n    id\\n    __typename\\n  }\\n  originalTitleText {\\n    text\\n    __typename\\n  }\\n  primaryImage {\\n    id\\n    width\\n    height\\n    url\\n    __typename\\n  }\\n  releaseYear {\\n    year\\n    endYear\\n    __typename\\n  }\\n  ratingsSummary {\\n    aggregateRating\\n    voteCount\\n    __typename\\n  }\\n  runtime {\\n    seconds\\n    __typename\\n  }\\n  certificate {\\n    rating\\n    __typename\\n  }\\n  canRate {\\n    isRatable\\n    __typename\\n  }\\n  canHaveEpisodes\\n}\\n\\nfragment TitleCardTrailer on Title {\\n  latestTrailer {\\n    id\\n    __typename\\n  }\\n}\\n\\nfragment TitleWatchOption on Title {\\n  primaryWatchOption {\\n    additionalWatchOptionsCount\\n    __typename\\n  }\\n}\\n\\nquery BatchPage_HomeMain($topPicksFirst: Int!, $topPicksAfter: String, $fanPicksFirst: Int!, $fanPicksAfter: ID, $inTheatersLocation: ShowtimesLocation!, $movieReleasingOnOrAfter: Date!, $movieViewerLocation: ShowtimesLocation!, $tvReleasingOnOrAfter: Date!, $bornToday: MonthDay!, $bornTodayFirst: Int!) {\\n  titleRecommendations(first: $topPicksFirst, after: $topPicksAfter) {\\n    edges {\\n      node {\\n        refTag\\n        title {\\n          ...BaseTitleCard\\n          ...TitleCardTrailer\\n          ...TitleWatchOption\\n          __typename\\n        }\\n        explanations {\\n          title {\\n            id\\n            titleText {\\n              text\\n              __typename\\n            }\\n            originalTitleText {\\n              text\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  fanPicksTitles(first: $fanPicksFirst, after: $fanPicksAfter) {\\n    edges {\\n      node {\\n        ...BaseTitleCard\\n        ...TitleCardTrailer\\n        ...TitleWatchOption\\n        __typename\\n      }\\n      __typename\\n    }\\n    refTag {\\n      ep13nReftag\\n      __typename\\n    }\\n    __typename\\n  }\\n  streamingTitles {\\n    provider {\\n      id\\n      name {\\n        value\\n        __typename\\n      }\\n      description {\\n        value\\n        __typename\\n      }\\n      refTagFragment\\n      __typename\\n    }\\n    titles(first: 25) {\\n      edges {\\n        node {\\n          title {\\n            ...BaseTitleCard\\n            ...TitleCardTrailer\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  showtimesTitles(first: 30, location: $inTheatersLocation, queryMetadata: {sortField: SHOWTIMES_COUNT, sortOrder: DESC}) {\\n    edges {\\n      node {\\n        ...BaseTitleCard\\n        ...TitleCardTrailer\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  comingSoonMovie: comingSoon(first: 50, comingSoonType: MOVIE, releasingOnOrAfter: $movieReleasingOnOrAfter) {\\n    edges {\\n      node {\\n        ...BaseTitleCard\\n        ...TitleCardTrailer\\n        releaseDate {\\n          day\\n          month\\n          year\\n          __typename\\n        }\\n        latestTrailer {\\n          name {\\n            value\\n            __typename\\n          }\\n          runtime {\\n            value\\n            __typename\\n          }\\n          thumbnail {\\n            height\\n            width\\n            url\\n            __typename\\n          }\\n          __typename\\n        }\\n        cinemas(first: 0, request: {location: $movieViewerLocation}) {\\n          total\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  comingSoonTV: comingSoon(first: 50, comingSoonType: TV, releasingOnOrAfter: $tvReleasingOnOrAfter) {\\n    edges {\\n      node {\\n        ...BaseTitleCard\\n        ...TitleCardTrailer\\n        releaseDate {\\n          day\\n          month\\n          year\\n          __typename\\n        }\\n        latestTrailer {\\n          name {\\n            value\\n            __typename\\n          }\\n          runtime {\\n            value\\n            __typename\\n          }\\n          thumbnail {\\n            height\\n            width\\n            url\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  bornToday(today: $bornToday, first: $bornTodayFirst) {\\n    edges {\\n      node {\\n        id\\n        nameText {\\n          text\\n          __typename\\n        }\\n        birth {\\n          date\\n          __typename\\n        }\\n        death {\\n          date\\n          __typename\\n        }\\n        primaryImage {\\n          caption {\\n            plainText\\n            __typename\\n          }\\n          url\\n          height\\n          width\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\",\"operationName\":\"BatchPage_HomeMain\",\"variables\":{\"topPicksFirst\":30,\"fanPicksFirst\":30,\"inTheatersLocation\":{\"radiusInMeters\":80467,\"latLong\":{\"lat\":\"-21.42\",\"long\":\"-47.93\"}},\"movieReleasingOnOrAfter\":\"2021-04-26\",\"movieViewerLocation\":{\"radiusInMeters\":80467,\"latLong\":{\"lat\":\"-21.42\",\"long\":\"-47.93\"}},\"tvReleasingOnOrAfter\":\"2021-04-26\",\"bornToday\":\"--04-25\",\"bornTodayFirst\":30}}';


	$.get('https://m.imdb.com/?getPublicToken', result => {
		let token = result.match(/{id: "(.*)"}/)[1]
		
		SetToken(token)
		
		$.post('https://graphql.imdb.com/', data, result => {
			console.log(result);
		})
	})

	//138-4423823-8476641
}