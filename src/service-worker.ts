import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@layer0/prefetch/sw'
import DeepFetchPlugin, { DeepFetchCallbackParam } from '@layer0/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: 'img.product-main-image',
        maxMatches: 1,
        attribute: 'src',
        as: 'image',
      },
      {
        selector: '.product-thumbnails-wrapper img',
        maxMatches: 2,
        attribute: 'data-src',
        as: 'image',
        callback: deepFetchPDPImages,
      },
      {
        selector: '.indiv-product img',
        maxMatches: 2,
        attribute: 'data-src',
        as: 'image',
        callback: deepFetchPLPImages,
      },
    ]),
  ],
})
  .route()
  .cache(/^https:\/\/assets-global\.website-files\.com\/.*/)
  // ENTER REGULAR EXPRESSION SELECTOR FOR IMAGES YOU WANT TO PREFETCH //
  // (usualy as CDN base domain name followed by ".*" as general selecor) //

///////////////////////////////////////////////
// Callback function for PDP image selector //
function deepFetchPDPImages({ $el, el, $ }: DeepFetchCallbackParam) {

  // Example implementation for Shopify CMS PDP images //
    const urlTemplate = $el.attr('data-src')
    // const dataWidths = $el.attr('data-widths')
    // for mobile we want to fetch the 900 width.
    // For desktop and the zoom image it would be the 1800.
    // Also some mobile versions seem to use 1800 so fetching both widths
    const width = "900"
    const zoomWidth = "1800"
    if (urlTemplate) {
      // const widths = JSON.parse(dataWidths)
      // for (let width of widths.slice(0, 2)) {
      //   const url = urlTemplate?.replace(/\{width\}/, width)
      //   prefetch(url, 'image')
      // }
      const url = urlTemplate.replace(/\{width\}/,width)
      const zoomUrl = urlTemplate.replace(/\{width\}/,zoomWidth)
      // console.log("[][]][][[][]][][][][][[]][[][][]\nPrefetching "+url+"\n")

      // Url prefetch
      prefetch(url, 'image')
      prefetch(zoomUrl, 'image')
    }
}

///////////////////////////////////////////////
// Callback function for PLP image selector //
function deepFetchPLPImages({ $el, el, $ }: DeepFetchCallbackParam) {

  // Example implementation if image source is provided in following format: //
  // <img data-src="https://www.cdn-url.com/image/image_id/{width}"          //
    const urlTemplate = $el.attr('data-src')
    const width = "300"
    if (urlTemplate) {
      const url = urlTemplate.replace(/\{width\}/,width)
      // console.log("[][]][][[][]][][][][][[]][[][][]\nPrefetching "+url+"\n")
      prefetch(url, 'image')
    }
}

// function logPrefetchedContent({$el}) { // for testing
//   // console.log("[][]][][[][]][][][][][[]][[][][]")
//   console.log("content '"+$el.attr('src')+"' has been prefetched...")
// }
