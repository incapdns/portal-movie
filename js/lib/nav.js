let Data = {"movie":"<li role=\"option\" id=\"react-autowhatever-1--item-0\" aria-selected=\"false\" class=\"react-autosuggest__suggestion react-autosuggest__suggestion--first\" data-suggestion-index=\"0\">\n <a class=\"title-btn searchResults__Result-sc-1pmqwbq-0 kyROKQ _3CzPBqlWRmSAoWxtvQQ5Eo _2xcsB5_XEiRCOYGbWQ05C9\" data-id=\"{id}\" data-testid=\"search-result--const\" href=\"{href}\">\n <div class=\"_2xcsB5_XEiRCOYGbWQ05C9__image\">\n <div class=\"ipc-media ipc-media--poster ipc-image-media-ratio--poster ipc-media--baseAlt ipc-media--custom ipc-media__img\" style=\"width: 100%;\"><img onerror=\"this.src = 'images/no-poster.png'\" class=\"ipc-image\" loading=\"lazy\" src=\"{image}\" width=\"50\"></div>\n </div>\n <div class=\"searchResults__ResultTextContainer-sc-1pmqwbq-1 khRmvD\">\n <div class=\"searchResults__ResultTextItem-sc-1pmqwbq-2 lolMki _26kHO_8bFBduUIYADnVHFY\">{title}</div>\n <div class=\"searchResults__ResultTextItem-sc-1pmqwbq-2 lolMki _1DoAqrviL4URifsx8tYz_V\">{year}</div>\n <div class=\"searchResults__ResultTextItem-sc-1pmqwbq-2 lolMki _1DoAqrviL4URifsx8tYz_V\">{description}</div>\n </div>\n </a>\n </li>\n","video":"<a style=\"padding-right: 0px;\" class=\"searchResults__Result-sc-1pmqwbq-0 kyROKQ _3CzPBqlWRmSAoWxtvQQ5Eo _2VTfSadvr91wa2jULYtbX2\" data-testid=\"search-result--video\" href=\"{href}\"> <div style=\"height: 80%;\" class=\"ipc-slate ipc-slate--baseAlt ipc-slate--dynamic-width ipc-sub-grid-item ipc-sub-grid-item--span-4\" role=\"group\"> <div class=\"ipc-media ipc-media--slate-16x9 ipc-image-media-ratio--slate-16x9 ipc-media--baseAlt ipc-media--slate-s ipc-slate__slate-image ipc-media__img\" style=\"width: 100%;\"><img onerror=\"this.src = 'images/no-poster.png'\" class=\"ipc-image\" loading=\"lazy\" src=\"{image}\" width=\"380\"></div> <div data-toggle=\"modal\" data-src=\"{src}\" data-target=\"#modal\" class=\"ipc-lockup-overlay video-btn\"> <div class=\"ipc-lockup-overlay__screen\"></div> <div class=\"ipc-lockup-overlay__gradient ipc-lockup-overlay__gradient--linear\"></div> <div class=\"ipc-lockup-overlay__content\"> <img src=\"images/icons/play.svg\"> <span class=\"ipc-lockup-overlay__text\">{time}</span> </div> </div> </div> <div class=\"searchResults__ResultTextItem-sc-1pmqwbq-2 lolMki _3Y2Rsr5ce7gB9vCd5oZ8Rg\"> {title} <div style=\"width: 1000px;\"></div> </div>\n</a>\n","itens":{"movie":["image","year","title","description","href","id"],"video":["image","title","time","href","src"]}}

class TImdbApi {
	item;
	
	latest;

	selector(item){
		if(item.__proto__.jquery)
			return item
			
		return $(item)
	}
	
	callback(data){
		//Clear old search
		this.item.empty()
		
		let search = $('.pm-nav-search-query')
		
		let valid = validateFn.call(search, this.item)
				
		let Fail = () => 
			this.item.parents('.results').hide()
		
		//Check if is valid
		if(!data.d || !valid) return Fail();
		if(!data.d.length) return Fail();
		
		//If valid show results:
		this.item.parents('.results').show()
		
		//HTML Generated
		let html = ''
		
		data.d.forEach(data => {
			//O resultado junto do redirecionamento é provido pela TheMovieDBAPI, sendo que video é linkado no m.imdb !

			html += '<ul role="listbox" class="suggestions-list">'
			
			let movie = Data.movie
									
			let image = data.i && data.i.length ? data.i[0] : 'images/no-poster.png'
						
			let year = data.y || ''
			
			let title = data.l, description = data.s || ''
			
			let itens = {title, year, description, image, href: '#', id: data.id}
			
			Data.itens.movie.forEach(item => {
				movie = movie.replace('{'+item+'}', itens[item])
			})
			
			html += movie
			
			let videos = data.v || []
			
			if(videos.length)
				html += '<li role="option" class="suggestion">'
			
			videos.forEach(data => {
				let video = Data.video
				
				let title = data.l, time = data.s || ''
				
				let image = data.i && data.i.length ? data.i[0] : 'images/no-poster.png'
								
				let itens = {title, time, image, href: '#'}
				
				itens.src = 'https://m.imdb.com/video/imdb/'+data.id+'/imdb/embed'
				
				Data.itens.video.forEach(item => {
					video = video.replace('{'+item+'}', itens[item])
				})
								
				html += video
			})
			
			if(videos.length)
				html += '</li>'
			
			html += '</ul>'
		})
				
		this.item.html(html)
		
		$('.title-btn', this.item).click(titleBtn);

		$('.video-btn', this.item).click(videoBtn);
	}

	constructor(item){
		this.item = this.selector(item)
	}
	
	Fetch(value){
		if(this.latest == value)
			return;
		
		this.latest = value
		
		$jsonp.send({
			callbackName: value,
			callback: this.callback.bind(this),
		})
	}
}

function validateFn(result){
	let term = this.val().trim()
	
	let value = term.replace(/[^a-zA-Z 0-9_]+/g, '')
					.replace(/ /g,'_')
					.toLowerCase();
	
	if(!value.length){
		result.empty()
		
		return false
	}
		
	
	return value
}

$(document).ready(() => {
	let results = $('ol.results')

	let result = results.find('div.result')
	
	let search = $('.pm-nav-search-query')
	
	let inputChecker = validateFn.bind(search, result)

	let imdb = new TImdbApi(result)

	search.on('blur change', (e) => {	
		setTimeout(() => {
			results.hide()
			
			inputChecker()
		}, 120)
	})
	
	search.on('focus', () => {
		if(result.find('ul').length)
			results.show()
	})
	
	search.on('input', () => {
		let value = inputChecker()
				
		if(value)
			return imdb.Fetch(value)
		
		results.hide()
	})
	
	$('.pm-nav-mobile-trigger').on('click', () => {		
		$('.pm-nav-mobile-dropdown').click()
	})
	
	$('.pm-nav-search-query').on('focus', () => {
		if($('.pm-nav-mobile-trigger:checked').length)
			$('.pm-nav-mobile-trigger').click()
	})
	
	$('.pm-nav-dropl-column-left li').on('click', () => {
		$('.pm-nav-mobile-trigger').click()
	})
	
	$('li a[href]').on('click', function(event){
	   event.preventDefault();
	   
	   let height = $('header').height(); //Menu height
	   
	   let size = 25 //Relative size: <hgroup>
	   
	   let section  = $(this).attr('href');
	   let top      = $(section).offset().top - height - size;
	   
	   $('html').animate({scrollTop: top}, 300);
	});

})