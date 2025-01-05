/* eslint-disable no-undef */
const _ = require('lodash');
const axios = require('axios');

const aniListService = {};

aniListService.getAnimeCharacters = async (animeId) => {
    // GraphQL query to fetch characters for a specific anime
  const query = `
  query media($id:Int,$type:MediaType,$isAdult:Boolean){Media(id:$id,type:$type,isAdult:$isAdult){id title{userPreferred romaji english native}coverImage{extraLarge large}bannerImage startDate{year month day}endDate{year month day}description season seasonYear type format status(version:2)episodes duration chapters volumes genres synonyms source(version:3)isAdult isLocked meanScore averageScore popularity favourites isFavouriteBlocked hashtag countryOfOrigin isLicensed isFavourite isRecommendationBlocked isFavouriteBlocked isReviewBlocked nextAiringEpisode{airingAt timeUntilAiring episode}relations{edges{id relationType(version:2)node{id title{userPreferred}format type status(version:2)bannerImage coverImage{large}}}}characterPreview:characters(perPage:15,sort:[ROLE,RELEVANCE,ID]){edges{id role name voiceActors(language:JAPANESE,sort:[RELEVANCE,ID]){id name{userPreferred}language:languageV2 image{large}}node{id name{userPreferred}image{large}}}}staffPreview:staff(perPage:8,sort:[RELEVANCE,ID]){edges{id role node{id name{userPreferred}language:languageV2 image{large}}}}studios{edges{isMain node{id name}}}reviewPreview:reviews(perPage:2,sort:[RATING_DESC,ID]){pageInfo{total}nodes{id summary rating ratingAmount user{id name avatar{large}}}}recommendations(perPage:7,sort:[RATING_DESC,ID]){pageInfo{total}nodes{id rating userRating mediaRecommendation{id title{userPreferred}format type status(version:2)bannerImage coverImage{large}}user{id name avatar{large}}}}externalLinks{id site url type language color icon notes isDisabled}streamingEpisodes{site title thumbnail url}trailer{id site}rankings{id rank type format year season allTime context}tags{id name description rank isMediaSpoiler isGeneralSpoiler userId}mediaListEntry{id status score}stats{statusDistribution{status amount}scoreDistribution{score amount}}}}
`;

// GraphQL variables to pass the anime ID dynamically
const variables = { id: animeId, type: 'ANIME', isAdult: false };

// Config for the POST request to AniList's GraphQL endpoint
const url = 'https://graphql.anilist.co';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  data: JSON.stringify({
    query: query,
    variables: variables,
  }),
};

try {
  const response = await axios(url, options);
  console.log(JSON.stringify(response.data.data.Media));
  const list = _.map(response.data.data.Media.characterPreview.edges, (edge) => edge.node.name.userPreferred);
  return {characters: list, title: response.data.data.Media.title.userPreferred};
} catch (error) {
  console.error('Error fetching anime characters:', error.message);
  throw error;
};
}
module.exports = aniListService