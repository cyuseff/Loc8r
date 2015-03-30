module.exports.list = function(request, response){
	response.render('location-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find plces to work with wifi near you!'
		},
		sidebar: 'Cras imperdiet nulla odio, vitae tempus ex mattis ac. Sed sit amet velit id nulla iaculis viverra. Nullam nisl urna, finibus nec efficitur a, mattis ut odio. Pellentesque porttitor lacus et orci pellentesque semper. Etiam egestas vel enim vel blandit.',
		locations:[
			{
				name: 'Starcups',
				address: '125 High Street, Reading, RG6 1PS',
				rating: 3,
				facilities: ['Hot drinks', 'Food', 'Premium wifi'],
				distance: '100m'
			},
			{
				name: 'Cafe Hero',
				address: '125 High Street, Reading, RG6 1PS',
				rating: 4,
				facilities: ['Hot drinks', 'Food', 'Premium wifi'],
				distance: '200m'
			},
			{
				name: 'Burger Queen',
				address: '125 High Street, Reading, RG6 1PS',
				rating: 2,
				facilities: ['Food', 'Premium wifi'],
				distance: '250m'
			}
		]
	});
}

module.exports.show = function(request, response){
	response.render('location-show', {'title': 'Location Show'});
}

module.exports.add_review = function(request, response){
	response.render('location-review-form', {'title': 'Add review'});
}