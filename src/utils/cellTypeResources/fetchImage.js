import { mapCellTypeName } from "./nameMapper";

export const fetchWikiImage = async (cellType) => {
  try {
    // Normalize the search term
    const updatedCellType = mapCellTypeName(cellType);

    // Search for Wikipedia page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|pageterms&generator=search&gsrsearch=${updatedCellType}&gsrlimit=1&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.query?.pages) return null;
    
    const pageId = Object.keys(searchData.query.pages)[0];
    
    // Get the page images
    const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images&pageids=${pageId}&origin=*`;
    const imagesResponse = await fetch(imagesUrl);
    const imagesData = await imagesResponse.json();
    
    const images = imagesData.query?.pages[pageId]?.images;
    if (!images) return null;
    
    // Find relevant image
    const relevantImage = images.find(img => 
      img.title.toLowerCase().includes(updatedCellType.toLowerCase()) ||
      img.title.toLowerCase().includes('cell')
    );
    
    if (!relevantImage) return null;
    
    // Get image URL and metadata
    const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(relevantImage.title)}&origin=*`;
    const imageInfoResponse = await fetch(imageInfoUrl);
    const imageInfoData = await imageInfoResponse.json();
    
    const imagePage = imageInfoData.query.pages[Object.keys(imageInfoData.query.pages)[0]];
    if (!imagePage.imageinfo?.[0]) return null;
    
    return {
      url: imagePage.imageinfo[0].url,
      attribution: imagePage.imageinfo[0].extmetadata?.Artist?.value || null
    };
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return null;
  }
};