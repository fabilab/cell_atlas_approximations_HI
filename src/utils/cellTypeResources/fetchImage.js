import { mapCellTypeName } from "./nameMapper";
import cell_image_source from "./cell_image_source.json";

// Helper functions to get image attribution
const getAttributionLabel = (url) => {
  if (!url) return null;
  if (url.includes("cildata.crbs.ucsd.edu")) return "Cell Image Library";
  if (url.includes("wikimedia.org")) return "Wikipedia";
  if (url.includes("wiley.com")) return "Wiley";
  return "Source";
};

const resolveSourceUrl = (cellType, source) => {
  if (!source) return null;
  if (source.includes("cildata.crbs.ucsd.edu")) {
    return `https://www.cellimagelibrary.org/browse/celltype`;
  }
  return source;
};

export const fetchCellImage = async (cellType) => {

  // 1. Try to get cell image from local path
  try {
    const localImage = require(`../../asset/cell_images/${cellType}.jpg`);
    const sourceUrl = cell_image_source[cellType];  
    return {
      url: localImage,
      attribution: getAttributionLabel(sourceUrl),
      sourceUrl: resolveSourceUrl(cellType, sourceUrl)
    };
  } catch (e) {
    console.warn(`[LOCAL] No local image found for ${cellType}`);
  }

    // 2. Fallback to Wikipedia
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
    
    const imageUrl = imagePage.imageinfo[0].url;

    return {
      url: imageUrl,
      attribution: getAttributionLabel(imageUrl),
      sourceUrl: imageUrl
    };
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return null;
  }
};