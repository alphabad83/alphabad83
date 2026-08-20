module.exports = function (eleventyConfig) {
  // Static passthroughs
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // Collections
    eleventyConfig.addCollection("equipes", (api) =>
     api.getFilteredByGlob("src/equipes/*.md").sort((a, b) => a.data.title.localeCompare(b.data.title))
   );
  eleventyConfig.addCollection("actualites", (api) =>
    api.getFilteredByGlob("src/actualites/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("tournois", (api) =>
    api.getFilteredByGlob("src/tournois/*.md").sort((a, b) => {
      const da = new Date(a.data.dateEvenement || a.date);
      const db = new Date(b.data.dateEvenement || b.date);
      return da - db;
    })
  );

  // Filters
  eleventyConfig.addFilter("dateFr", (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  });

  eleventyConfig.addFilter("dateFrCourt", (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
