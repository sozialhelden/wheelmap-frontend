module.exports = async function getCurrentUrl() {
  const url = await browser.execute(() => {
    return window.location.href;
  });
  console.log('Current URL:', url);
  return url;
};
