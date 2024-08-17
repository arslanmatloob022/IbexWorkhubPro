// vite.config.ts
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/vite@5.0.0-beta.0_@types+node@20.4.5_sass-embedded@1.66.1/node_modules/vite/dist/node/index.js";
import Vue from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/@vitejs+plugin-vue@4.3.3_vite@5.0.0-beta.0_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/unplugin-vue-router@0.6.4_rollup@2.79.1_vue-router@4.2.4_vue@3.3.4/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/unplugin-vue-router@0.6.4_rollup@2.79.1_vue-router@4.2.4_vue@3.3.4/node_modules/unplugin-vue-router/dist/index.mjs";
import Components from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/unplugin-vue-components@0.25.1_rollup@2.79.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/unplugin-auto-import@0.16.6_@vueuse+core@10.4.0_rollup@2.79.1/node_modules/unplugin-auto-import/dist/vite.js";
import Unfonts from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/unplugin-fonts@1.0.3_vite@5.0.0-beta.0/node_modules/unplugin-fonts/dist/vite.mjs";
import { VitePluginRadar } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/vite-plugin-radar@0.9.1_vite@5.0.0-beta.0/node_modules/vite-plugin-radar/dist/index.js";
import PurgeIcons from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/vite-plugin-purge-icons@0.9.2_vite@5.0.0-beta.0/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import ImageMin from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/vite-plugin-imagemin@0.6.1_vite@5.0.0-beta.0/node_modules/vite-plugin-imagemin/dist/index.mjs";
import VueI18nPlugin from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/@intlify+unplugin-vue-i18n@0.12.3_rollup@2.79.1_vue-i18n@9.3.0-beta.25/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { VitePWA } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/vite-plugin-pwa@0.16.4_vite@5.0.0-beta.0_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
import purgecss from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/rollup-plugin-purgecss@5.0.0/node_modules/rollup-plugin-purgecss/lib/rollup-plugin-purgecss.js";
import UnheadVite from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/@unhead+addons@1.3.7_rollup@2.79.1/node_modules/@unhead/addons/dist/vite.mjs";
import { unheadVueComposablesImports } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/@unhead+vue@1.3.7_vue@3.3.4/node_modules/@unhead/vue/dist/index.mjs";

// vite-plugin-vuero-doc/index.ts
import { join, basename } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/pathe@1.1.1/node_modules/pathe/dist/index.mjs";
import { compileTemplate, parse } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/@vue+compiler-sfc@3.3.4/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";

// vite-plugin-vuero-doc/markdown.ts
import yaml from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/js-yaml@4.1.0/node_modules/js-yaml/dist/js-yaml.mjs";
import remarkShiki from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/@stefanprobst+remark-shiki@2.2.1_shiki@0.14.3/node_modules/@stefanprobst/remark-shiki/src/index.js";
import rehypeExternalLinks from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/rehype-external-links@2.1.0/node_modules/rehype-external-links/index.js";
import rehypeRaw from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/index.js";
import rehypeSlug from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/rehype-slug@5.1.0/node_modules/rehype-slug/index.js";
import rehypeAutolinkHeadings from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/rehype-autolink-headings@6.1.1/node_modules/rehype-autolink-headings/index.js";
import rehypeStringify from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/rehype-stringify@10.0.0/node_modules/rehype-stringify/index.js";
import remarkParse from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/remark-parse@10.0.2/node_modules/remark-parse/index.js";
import remarkGfm from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/remark-gfm@3.0.1/node_modules/remark-gfm/index.js";
import remarkRehype from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/remark-rehype@10.1.0/node_modules/remark-rehype/index.js";
import remarkFrontmatter from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/remark-frontmatter@4.0.1/node_modules/remark-frontmatter/index.js";
import { getHighlighter } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/shiki@0.14.3/node_modules/shiki/dist/index.js";
import { unified } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/unified@11.0.2/node_modules/unified/index.js";
var langs = ["vue", "vue-html", "typescript", "bash", "scss"];
async function createProcessor(theme) {
  const highlighter = await getHighlighter({
    theme,
    langs
  });
  return unified().use(remarkParse).use(remarkFrontmatter).use(() => (tree, file) => {
    if (tree.children[0].type === "yaml") {
      file.data.frontmatter = yaml.load(tree.children[0].value);
    }
  }).use(remarkGfm).use(remarkShiki, { highlighter }).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeExternalLinks, { rel: ["nofollow"], target: "_blank" }).use(rehypeSlug).use(rehypeAutolinkHeadings, {
    behavior: "append",
    content: {
      type: "element",
      tagName: "i",
      properties: {
        className: ["iconify toc-link-anchor"],
        dataIcon: "feather:link"
      },
      children: []
    },
    test: (node) => {
      if (Array.isArray(node.properties?.className) && node.properties?.className?.includes("toc-ignore")) {
        return false;
      }
      return Boolean(node.properties?.id);
    }
  }).use(rehypeStringify);
}
async function createProcessors(theme) {
  return {
    light: await createProcessor(typeof theme === "string" ? theme : theme.light),
    dark: await createProcessor(typeof theme === "string" ? theme : theme.dark)
  };
}

// vite-plugin-vuero-doc/transform.ts
import { kebabCase } from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/scule@1.0.0/node_modules/scule/dist/index.mjs";
var SELF_CLOSING_TAG_REGEX = /<([^\s></]+)([^>]+)\/>/g;
var OPEN_TAG_REGEX = /<([^\s></]+)/g;
var CLOSE_TAG_REGEX = /<\/([^\s></]+)/g;
function transformExampleMarkup(raw) {
  let output = raw;
  let content = null;
  if (content = raw.match(/<!--example-->([\s\S]*?)<!--\/example-->/)) {
    const kebabContent = content[1].replaceAll(SELF_CLOSING_TAG_REGEX, (substring, tag) => {
      return substring.replace("/>", `></${tag.trim()}>`);
    }).replaceAll(OPEN_TAG_REGEX, (substring) => {
      return `<${kebabCase(substring.substring(1).trim())}`;
    }).replaceAll(CLOSE_TAG_REGEX, (substring) => {
      return `</${kebabCase(substring.substring(2).trim())}`;
    }).replaceAll("&#x27;", "'");
    output = output.replace(content[1], kebabContent);
  }
  return output;
}
function transformSlots(source, condition = "") {
  if (source.includes("<!--code-->") && source.includes("<!--example-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--code-->`,
      `</template><template ${condition} #code>
<slot name="code"><div v-pre>`
    ).replace(`<!--/code-->`, `</div></slot>
</template>`).replace(
      `<!--example-->`,
      `<template ${condition} #example>
<slot name="example">`
    ).replace(`<!--/example-->`, `</slot>
</template>`);
  }
  if (source.includes("<!--code-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--code-->`,
      `</template><template ${condition} #code>
<slot name="code"><div v-pre>`
    ).replace(
      `<!--/code-->`,
      `</div></slot>
</template>
<template ${condition} #example><slot name="example"></slot></template>`
    );
  }
  if (source.includes("<!--example-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--example-->`,
      `</template><template ${condition} #example>
<slot name="example">`
    ).replace(
      `<!--/example-->`,
      `</slot>
</template>
<template ${condition} #code><slot name="code"></slot></template>`
    );
  }
  return `<template ${condition} #default>${source}</template><template ${condition} #example><slot name="example"></slot></template><template ${condition} #code><slot name="code"></slot></template>`;
}

// vite-plugin-vuero-doc/index.ts
function parseId(id) {
  const index = id.indexOf("?");
  if (index < 0)
    return id;
  else
    return id.slice(0, index);
}
function VitePluginVueroDoc(options) {
  let config;
  let processors;
  const cwd = process.cwd();
  const pathPrefix = options.pathPrefix ? join(cwd, options.pathPrefix) : cwd;
  async function markdownToVue(id, raw) {
    const path = parseId(id);
    const input = transformExampleMarkup(raw);
    if (!processors)
      processors = await createProcessors(options.shiki.theme);
    const [vFileLight, vFileDark] = await Promise.all([
      processors.light.process(input),
      processors.dark.process(input)
    ]);
    const contentLight = vFileLight.toString();
    const contentDark = vFileDark.toString();
    const frontmatter = vFileLight.data?.frontmatter ?? {};
    const slotLight = transformSlots(contentLight, 'v-if="!darkmode.isDark"');
    const slotDark = transformSlots(contentDark, 'v-if="darkmode.isDark"');
    const sfc = [
      `<template>`,
      `  <${options.wrapperComponent} :frontmatter="frontmatter" :source-meta="sourceMeta">`,
      `    ${slotLight}`,
      `    ${slotDark}`,
      `  </${options.wrapperComponent}>`,
      `</template>`
    ].join("\n");
    const result = parse(sfc, {
      filename: path,
      sourceMap: true
    });
    if (result.errors.length || result.descriptor.template === null) {
      console.error(result.errors);
      throw new Error(`Markdown: unable to parse virtual file generated for "${id}"`);
    }
    const { code, errors } = compileTemplate({
      filename: path,
      id: path,
      source: result.descriptor.template.content,
      preprocessLang: result.descriptor.template.lang,
      transformAssetUrls: false
    });
    if (errors.length) {
      console.error(errors);
      throw new Error(`Markdown: unable to compile virtual file "${id}"`);
    }
    let sourceMeta = "undefined";
    if (options.sourceMeta?.enabled) {
      sourceMeta = JSON.stringify({
        relativePath: path.substring(cwd.length),
        basename: basename(path),
        path: config?.isProduction ? "" : path,
        editProtocol: config?.isProduction ? "" : options.sourceMeta.editProtocol
      });
    }
    const output = [
      `import { reactive } from 'vue'`,
      `import { useDarkmode } from '/@src/stores/darkmode'`,
      code.replace("export function render", "function render"),
      `const __frontmatter = ${JSON.stringify(frontmatter)};`,
      `const setup = () => ({`,
      `  frontmatter: reactive(__frontmatter),`,
      `  darkmode: useDarkmode(),`,
      `  sourceMeta: ${sourceMeta},`,
      `});`,
      `const __script = { render, setup };`,
      config?.isProduction ? "" : `__script.__hmrId = ${JSON.stringify(path)};`,
      `export default __script;`
    ].join("\n");
    return output;
  }
  return {
    name: "vite-plugin-vuero-doc",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    async transform(raw, id) {
      if (id.endsWith(".md") && id.startsWith(pathPrefix)) {
        return await markdownToVue(id, raw);
      }
    }
  };
}

// vite-plugin-purge-comments/index.ts
import MagicString from "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/node_modules/.pnpm/magic-string@0.30.3/node_modules/magic-string/dist/magic-string.es.mjs";
function parseId2(id) {
  const index = id.indexOf("?");
  if (index < 0)
    return id;
  else
    return id.slice(0, index);
}
function VitePluginPurgeComments({ sourcemap = false } = {}) {
  return {
    name: "purge-comments",
    enforce: "pre",
    transform: (code, id) => {
      const parsedId = parseId2(id);
      if (!(parsedId.endsWith(".vue") || parsedId.endsWith(".html") || parsedId.endsWith(".svg"))) {
        return;
      }
      if (!code.includes("<!--")) {
        return;
      }
      const s = new MagicString(code);
      s.replace(/<!--[\w\W\s]*?-->/g, "");
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: sourcemap && s.generateMap({ source: id, includeContent: true })
        };
      }
    }
  };
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///home/adnan/working_repo/themeforest-7DoelxEY-vuero-vuejs-3-admin-and-webapp-ui-kit/template-vuero-v2.8.1/vite.config.ts";
var MINIFY_IMAGES = process.env.MINIFY ? process.env.MINIFY === "true" : false;
var isProd = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  // Project root directory (where index.html is located).
  root: process.cwd(),
  // Base public path when served in development or production.
  // You also need to add this base like `history: createWebHistory('my-subdirectory')`
  // in ./src/router.ts
  // base: '/my-subdirectory/',
  base: "/",
  // Directory to serve as plain static assets.
  publicDir: "public",
  // Adjust console output verbosity.
  logLevel: "info",
  // development server configuration
  server: {
    // Vite 4 defaults to 5173, but you can override it with the port option.
    port: 3e3
  },
  /**
   * Define allow to replace string in the code at build time.
   */
  define: {
    // VSCODE_TEXTMATE_DEBUG is used in shiki, but it's not defined in the browser
    "process.env.VSCODE_TEXTMATE_DEBUG": "false"
  },
  /**
   * By default, Vite will crawl your index.html to detect dependencies that
   * need to be pre-bundled. If build.rollupOptions.input is specified,
   * Vite will crawl those entry points instead.
   *
   * @see https://vitejs.dev/config/#optimizedeps-entries
   */
  optimizeDeps: {
    include: [
      "@ckeditor/ckeditor5-vue",
      "@ckeditor/ckeditor5-build-classic",
      "@iconify/iconify",
      "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js",
      "@vee-validate/zod",
      "@vueuse/core",
      "@vueform/multiselect",
      "@vueform/slider",
      "billboard.js",
      "dayjs",
      "dropzone",
      "dragula",
      "defu",
      "filepond",
      "filepond-plugin-file-validate-size",
      "filepond-plugin-file-validate-type",
      "filepond-plugin-image-exif-orientation",
      "filepond-plugin-image-crop",
      "filepond-plugin-image-edit",
      "filepond-plugin-image-preview",
      "filepond-plugin-image-resize",
      "filepond-plugin-image-transform",
      "focus-trap-vue",
      "imask",
      "nprogress",
      "notyf",
      "mapbox-gl",
      "photoswipe/lightbox",
      "photoswipe",
      "plyr",
      "v-calendar",
      "vee-validate",
      "vue",
      "vue-scrollto",
      "vue3-apexcharts",
      "vue-tippy",
      "vue-i18n",
      "vue-router",
      "unplugin-vue-router/runtime",
      "simplebar",
      "tiny-slider/src/tiny-slider",
      "vue-accessible-color-picker",
      "zod",
      "@stefanprobst/remark-shiki",
      "rehype-external-links",
      "rehype-raw",
      "rehype-sanitize",
      "rehype-stringify",
      "rehype-slug",
      "rehype-autolink-headings",
      "remark-gfm",
      "remark-parse",
      "remark-rehype",
      "shiki",
      "unified",
      "workbox-window",
      "textarea-markdown-editor/dist/esm/bootstrap"
    ]
    // disabled: false,
  },
  // Will be passed to @rollup/plugin-alias as its entries option.
  resolve: {
    alias: [
      {
        find: "/@src/",
        replacement: `/src/`
      }
    ]
  },
  build: {
    target: "esnext",
    minify: "terser",
    // Do not warn about large chunks
    // chunkSizeWarningLimit: Infinity,
    // Double the default size threshold for inlined assets
    // https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
    assetsInlineLimit: 4096 * 2
    // commonjsOptions: { include: [] },
  },
  plugins: [
    /**
     * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
     *
     * @see https://github.com/vitejs/vite/tree/main/packages/plugin-vue
     */
    Vue({
      include: [/\.vue$/],
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    /**
     * unplugin-vue-i18n plugin does i18n resources pre-compilation / optimizations
     *
     * @see https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md
     */
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src/locales/**"),
      fullInstall: false,
      compositionOnly: true
    }),
    /**
     * unplugin-vue-router plugin generate routes based on file system
     * allow to use typed routes and usage of defineLoader
     *
     * @see https://github.com/posva/unplugin-vue-router
     * @see https://github.com/vuejs/rfcs/blob/ad69da2aee9242ef88f036713db68f3ef274bb1b/active-rfcs/0000-router-use-loader.md
     */
    VueRouter({
      routesFolder: "src/pages",
      dts: "./types/router.d.ts",
      /**
       * Data Fetching is an experimental feature from vue & vue-router
       *
       * @see https://github.com/vuejs/rfcs/discussions/460
       * @see https://github.com/posva/unplugin-vue-router/tree/main/src/data-fetching
       */
      dataFetching: true
    }),
    /**
     * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
     *
     * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
     */
    UnheadVite(),
    /**
     * unplugin-auto-import allow to automaticaly import modules/components
     *
     * @see https://github.com/antfu/unplugin-auto-import
     */
    AutoImport({
      dts: "./types/imports.d.ts",
      imports: ["vue", "@vueuse/core", VueRouterAutoImports, unheadVueComposablesImports]
    }),
    /**
     * This is an internal vite plugin that load markdown files as vue components.
     *
     * @see /documentation
     * @see /vite-plugin-vuero-doc
     * @see /src/components/partials/documentation/DocumentationItem.vue
     * @see /src/composable/useMarkdownToc.ts
     */
    VitePluginVueroDoc({
      pathPrefix: "documentation",
      wrapperComponent: "DocumentationItem",
      shiki: {
        theme: {
          light: "min-light",
          dark: "github-dark"
        }
      },
      sourceMeta: {
        enabled: true,
        editProtocol: "vscode://vscode-remote/wsl+Ubuntu"
        // or 'vscode://file'
      }
    }),
    /**
     * This is an internal vite plugin that remove html comments from code.
     *
     * @see /vite-plugin-purge-comments
     */
    VitePluginPurgeComments(),
    /**
     * unplugin-vue-components plugin is responsible of autoloading components
     * documentation and md file are loaded for elements and components sections
     *
     * @see https://github.com/antfu/unplugin-vue-components
     */
    Components({
      dirs: ["documentation", "src/components", "src/layouts"],
      extensions: ["vue", "md"],
      dts: "./types/components.d.ts",
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
    }),
    /**
     * vite-plugin-purge-icons plugin is responsible of autoloading icones from multiples providers
     *
     * @see https://icones.netlify.app/
     * @see https://github.com/antfu/purge-icons/tree/main/packages/vite-plugin-purge-icons
     */
    PurgeIcons(),
    /**
     * vite-plugin-fonts plugin inject webfonts from differents providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-fonts
     */
    Unfonts({
      google: {
        families: [
          {
            name: "Fira Code",
            styles: "wght@400;600"
          },
          {
            name: "Montserrat",
            styles: "wght@500;600;700;800;900"
          },
          {
            name: "Roboto",
            styles: "wght@300;400;500;600;700"
          }
        ]
      }
    }),
    /**
     * vite-plugin-radar plugin inject snippets from analytics providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-radar
     */
    !process.env.GTM_ID ? void 0 : VitePluginRadar({
      gtm: {
        id: process.env.GTM_ID
      }
    }),
    /**
     * vite-plugin-pwa generate manifest.json and register services worker to enable PWA
     *
     * @see https://github.com/antfu/vite-plugin-pwa
     */
    VitePWA({
      base: "/",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "AREZ - Workforce Management Software",
        short_name: "Vuero",
        start_url: "/?utm_source=pwa",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      mode: isProd ? "production" : "development",
      // registerType: 'autoUpdate',
      workbox: {
        /**
         * precache files that match the glob pattern
         *
         * @see https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
         */
        globPatterns: ["**/*.{js,css,ico,png,svg,webp,jpg,jpeg}"],
        /**
         * add external cache of google fonts
         *
         * @see https://vite-pwa-org.netlify.app/workbox/generate-sw.html
         */
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    /**
     * rollup-plugin-purgecss plugin is responsible of purging css rules
     * that are not used in the bundle
     *
     * @see https://github.com/FullHuman/purgecss/tree/main/packages/rollup-plugin-purgecss
     */
    purgecss({
      output: false,
      content: [`./src/**/*.vue`],
      variables: false,
      safelist: {
        standard: [
          /(autv|lnil|lnir|fas?)/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/
        ]
      },
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
      }
    }),
    /**
     * vite-plugin-imagemin optimize all images sizes from public or asset folder
     *
     * @see https://github.com/anncwb/vite-plugin-imagemin
     */
    !MINIFY_IMAGES ? void 0 : ImageMin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 60
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false
          },
          {
            name: "removeEmptyAttrs",
            active: false
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50cyIsICJ2aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzIiwgInZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hZG5hbi93b3JraW5nX3JlcG8vdGhlbWVmb3Jlc3QtN0RvZWx4RVktdnVlcm8tdnVlanMtMy1hZG1pbi1hbmQtd2ViYXBwLXVpLWtpdC90ZW1wbGF0ZS12dWVyby12Mi44LjEvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgVW5mb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJ1xuaW1wb3J0IHsgVml0ZVBsdWdpblJhZGFyIH0gZnJvbSAndml0ZS1wbHVnaW4tcmFkYXInXG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZS1pY29ucydcbmltcG9ydCBJbWFnZU1pbiBmcm9tICd2aXRlLXBsdWdpbi1pbWFnZW1pbidcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuaW1wb3J0IHB1cmdlY3NzIGZyb20gJ3JvbGx1cC1wbHVnaW4tcHVyZ2Vjc3MnXG5pbXBvcnQgVW5oZWFkVml0ZSBmcm9tICdAdW5oZWFkL2FkZG9ucy92aXRlJ1xuaW1wb3J0IHsgdW5oZWFkVnVlQ29tcG9zYWJsZXNJbXBvcnRzIH0gZnJvbSAnQHVuaGVhZC92dWUnXG5cbi8vIGxvY2FsIHZpdGUgcGx1Z2luXG5pbXBvcnQgeyBWaXRlUGx1Z2luVnVlcm9Eb2MgfSBmcm9tICcuL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYydcbmltcG9ydCB7IFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzIH0gZnJvbSAnLi92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50cydcblxuLy8gb3B0aW9ucyB2aWEgZW52IHZhcmlhYmxlc1xuY29uc3QgTUlOSUZZX0lNQUdFUyA9IHByb2Nlc3MuZW52Lk1JTklGWSA/IHByb2Nlc3MuZW52Lk1JTklGWSA9PT0gJ3RydWUnIDogZmFsc2VcblxuY29uc3QgaXNQcm9kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIG1haW4gY29uZmlndXJhdGlvbiBmaWxlIGZvciB2aXRlanNcbiAqXG4gKiBAc2VlIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gUHJvamVjdCByb290IGRpcmVjdG9yeSAod2hlcmUgaW5kZXguaHRtbCBpcyBsb2NhdGVkKS5cbiAgcm9vdDogcHJvY2Vzcy5jd2QoKSxcbiAgLy8gQmFzZSBwdWJsaWMgcGF0aCB3aGVuIHNlcnZlZCBpbiBkZXZlbG9wbWVudCBvciBwcm9kdWN0aW9uLlxuICAvLyBZb3UgYWxzbyBuZWVkIHRvIGFkZCB0aGlzIGJhc2UgbGlrZSBgaGlzdG9yeTogY3JlYXRlV2ViSGlzdG9yeSgnbXktc3ViZGlyZWN0b3J5JylgXG4gIC8vIGluIC4vc3JjL3JvdXRlci50c1xuICAvLyBiYXNlOiAnL215LXN1YmRpcmVjdG9yeS8nLFxuICBiYXNlOiAnLycsXG4gIC8vIERpcmVjdG9yeSB0byBzZXJ2ZSBhcyBwbGFpbiBzdGF0aWMgYXNzZXRzLlxuICBwdWJsaWNEaXI6ICdwdWJsaWMnLFxuICAvLyBBZGp1c3QgY29uc29sZSBvdXRwdXQgdmVyYm9zaXR5LlxuICBsb2dMZXZlbDogJ2luZm8nLFxuICAvLyBkZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICBzZXJ2ZXI6IHtcbiAgICAvLyBWaXRlIDQgZGVmYXVsdHMgdG8gNTE3MywgYnV0IHlvdSBjYW4gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgcG9ydCBvcHRpb24uXG4gICAgcG9ydDogMzAwMCxcbiAgfSxcbiAgLyoqXG4gICAqIERlZmluZSBhbGxvdyB0byByZXBsYWNlIHN0cmluZyBpbiB0aGUgY29kZSBhdCBidWlsZCB0aW1lLlxuICAgKi9cbiAgZGVmaW5lOiB7XG4gICAgLy8gVlNDT0RFX1RFWFRNQVRFX0RFQlVHIGlzIHVzZWQgaW4gc2hpa2ksIGJ1dCBpdCdzIG5vdCBkZWZpbmVkIGluIHRoZSBicm93c2VyXG4gICAgJ3Byb2Nlc3MuZW52LlZTQ09ERV9URVhUTUFURV9ERUJVRyc6ICdmYWxzZScsXG4gIH0sXG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBWaXRlIHdpbGwgY3Jhd2wgeW91ciBpbmRleC5odG1sIHRvIGRldGVjdCBkZXBlbmRlbmNpZXMgdGhhdFxuICAgKiBuZWVkIHRvIGJlIHByZS1idW5kbGVkLiBJZiBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0IGlzIHNwZWNpZmllZCxcbiAgICogVml0ZSB3aWxsIGNyYXdsIHRob3NlIGVudHJ5IHBvaW50cyBpbnN0ZWFkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvI29wdGltaXplZGVwcy1lbnRyaWVzXG4gICAqL1xuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAnQGNrZWRpdG9yL2NrZWRpdG9yNS12dWUnLFxuICAgICAgJ0Bja2VkaXRvci9ja2VkaXRvcjUtYnVpbGQtY2xhc3NpYycsXG4gICAgICAnQGljb25pZnkvaWNvbmlmeScsXG4gICAgICAnQG1hcGJveC9tYXBib3gtZ2wtZ2VvY29kZXIvZGlzdC9tYXBib3gtZ2wtZ2VvY29kZXIubWluLmpzJyxcbiAgICAgICdAdmVlLXZhbGlkYXRlL3pvZCcsXG4gICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICdAdnVlZm9ybS9tdWx0aXNlbGVjdCcsXG4gICAgICAnQHZ1ZWZvcm0vc2xpZGVyJyxcbiAgICAgICdiaWxsYm9hcmQuanMnLFxuICAgICAgJ2RheWpzJyxcbiAgICAgICdkcm9wem9uZScsXG4gICAgICAnZHJhZ3VsYScsXG4gICAgICAnZGVmdScsXG4gICAgICAnZmlsZXBvbmQnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1maWxlLXZhbGlkYXRlLXNpemUnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1maWxlLXZhbGlkYXRlLXR5cGUnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1pbWFnZS1leGlmLW9yaWVudGF0aW9uJyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4taW1hZ2UtY3JvcCcsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWltYWdlLWVkaXQnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1pbWFnZS1wcmV2aWV3JyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4taW1hZ2UtcmVzaXplJyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4taW1hZ2UtdHJhbnNmb3JtJyxcbiAgICAgICdmb2N1cy10cmFwLXZ1ZScsXG4gICAgICAnaW1hc2snLFxuICAgICAgJ25wcm9ncmVzcycsXG4gICAgICAnbm90eWYnLFxuICAgICAgJ21hcGJveC1nbCcsXG4gICAgICAncGhvdG9zd2lwZS9saWdodGJveCcsXG4gICAgICAncGhvdG9zd2lwZScsXG4gICAgICAncGx5cicsXG4gICAgICAndi1jYWxlbmRhcicsXG4gICAgICAndmVlLXZhbGlkYXRlJyxcbiAgICAgICd2dWUnLFxuICAgICAgJ3Z1ZS1zY3JvbGx0bycsXG4gICAgICAndnVlMy1hcGV4Y2hhcnRzJyxcbiAgICAgICd2dWUtdGlwcHknLFxuICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICd1bnBsdWdpbi12dWUtcm91dGVyL3J1bnRpbWUnLFxuICAgICAgJ3NpbXBsZWJhcicsXG4gICAgICAndGlueS1zbGlkZXIvc3JjL3Rpbnktc2xpZGVyJyxcbiAgICAgICd2dWUtYWNjZXNzaWJsZS1jb2xvci1waWNrZXInLFxuICAgICAgJ3pvZCcsXG4gICAgICAnQHN0ZWZhbnByb2JzdC9yZW1hcmstc2hpa2knLFxuICAgICAgJ3JlaHlwZS1leHRlcm5hbC1saW5rcycsXG4gICAgICAncmVoeXBlLXJhdycsXG4gICAgICAncmVoeXBlLXNhbml0aXplJyxcbiAgICAgICdyZWh5cGUtc3RyaW5naWZ5JyxcbiAgICAgICdyZWh5cGUtc2x1ZycsXG4gICAgICAncmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzJyxcbiAgICAgICdyZW1hcmstZ2ZtJyxcbiAgICAgICdyZW1hcmstcGFyc2UnLFxuICAgICAgJ3JlbWFyay1yZWh5cGUnLFxuICAgICAgJ3NoaWtpJyxcbiAgICAgICd1bmlmaWVkJyxcbiAgICAgICd3b3JrYm94LXdpbmRvdycsXG4gICAgICAndGV4dGFyZWEtbWFya2Rvd24tZWRpdG9yL2Rpc3QvZXNtL2Jvb3RzdHJhcCcsXG4gICAgXSxcbiAgICAvLyBkaXNhYmxlZDogZmFsc2UsXG4gIH0sXG4gIC8vIFdpbGwgYmUgcGFzc2VkIHRvIEByb2xsdXAvcGx1Z2luLWFsaWFzIGFzIGl0cyBlbnRyaWVzIG9wdGlvbi5cbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6ICcvQHNyYy8nLFxuICAgICAgICByZXBsYWNlbWVudDogYC9zcmMvYCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgLy8gRG8gbm90IHdhcm4gYWJvdXQgbGFyZ2UgY2h1bmtzXG4gICAgLy8gY2h1bmtTaXplV2FybmluZ0xpbWl0OiBJbmZpbml0eSxcbiAgICAvLyBEb3VibGUgdGhlIGRlZmF1bHQgc2l6ZSB0aHJlc2hvbGQgZm9yIGlubGluZWQgYXNzZXRzXG4gICAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9idWlsZC1vcHRpb25zLmh0bWwjYnVpbGQtYXNzZXRzaW5saW5lbGltaXRcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiAqIDIsXG4gICAgLy8gY29tbW9uanNPcHRpb25zOiB7IGluY2x1ZGU6IFtdIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICAvKipcbiAgICAgKiBwbHVnaW4tdnVlIHBsdWdpbiBpbmplY3QgdnVlIGxpYnJhcnkgYW5kIGFsbG93IHNmYyBmaWxlcyB0byB3b3JrICgqLnZ1ZSlcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL3RyZWUvbWFpbi9wYWNrYWdlcy9wbHVnaW4tdnVlXG4gICAgICovXG4gICAgVnVlKHtcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC9dLFxuICAgICAgc2NyaXB0OiB7XG4gICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLFxuICAgICAgICBwcm9wc0Rlc3RydWN0dXJlOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLXZ1ZS1pMThuIHBsdWdpbiBkb2VzIGkxOG4gcmVzb3VyY2VzIHByZS1jb21waWxhdGlvbiAvIG9wdGltaXphdGlvbnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ludGxpZnkvYnVuZGxlLXRvb2xzL2Jsb2IvbWFpbi9wYWNrYWdlcy91bnBsdWdpbi12dWUtaTE4bi9SRUFETUUubWRcbiAgICAgKi9cbiAgICBWdWVJMThuUGx1Z2luKHtcbiAgICAgIGluY2x1ZGU6IHJlc29sdmUoZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCAnLi9zcmMvbG9jYWxlcy8qKicpLFxuICAgICAgZnVsbEluc3RhbGw6IGZhbHNlLFxuICAgICAgY29tcG9zaXRpb25Pbmx5OiB0cnVlLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tdnVlLXJvdXRlciBwbHVnaW4gZ2VuZXJhdGUgcm91dGVzIGJhc2VkIG9uIGZpbGUgc3lzdGVtXG4gICAgICogYWxsb3cgdG8gdXNlIHR5cGVkIHJvdXRlcyBhbmQgdXNhZ2Ugb2YgZGVmaW5lTG9hZGVyXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3N2YS91bnBsdWdpbi12dWUtcm91dGVyXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvcmZjcy9ibG9iL2FkNjlkYTJhZWU5MjQyZWY4OGYwMzY3MTNkYjY4ZjNlZjI3NGJiMWIvYWN0aXZlLXJmY3MvMDAwMC1yb3V0ZXItdXNlLWxvYWRlci5tZFxuICAgICAqL1xuICAgIFZ1ZVJvdXRlcih7XG4gICAgICByb3V0ZXNGb2xkZXI6ICdzcmMvcGFnZXMnLFxuICAgICAgZHRzOiAnLi90eXBlcy9yb3V0ZXIuZC50cycsXG5cbiAgICAgIC8qKlxuICAgICAgICogRGF0YSBGZXRjaGluZyBpcyBhbiBleHBlcmltZW50YWwgZmVhdHVyZSBmcm9tIHZ1ZSAmIHZ1ZS1yb3V0ZXJcbiAgICAgICAqXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy9yZmNzL2Rpc2N1c3Npb25zLzQ2MFxuICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlci90cmVlL21haW4vc3JjL2RhdGEtZmV0Y2hpbmdcbiAgICAgICAqL1xuICAgICAgZGF0YUZldGNoaW5nOiB0cnVlLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogVW5oZWFkIHByb3ZpZGVzIGEgVml0ZSBwbHVnaW4gdG8gb3B0aW1pc2UgeW91ciBidWlsZHMsIGJ5IHJlbW92aW5nIGNvbXBvc2FibGVzIHRoYXQgYXJlbid0IG5lZWRlZCBhbmQgc2ltcGxpZnlpbmcgeW91ciBjb2RlLlxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL3VuaGVhZC5oYXJsYW56dy5jb20vZ3VpZGUvZ2V0dGluZy1zdGFydGVkL3ZpdGUtcGx1Z2luXG4gICAgICovXG4gICAgVW5oZWFkVml0ZSgpLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tYXV0by1pbXBvcnQgYWxsb3cgdG8gYXV0b21hdGljYWx5IGltcG9ydCBtb2R1bGVzL2NvbXBvbmVudHNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgICovXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBkdHM6ICcuL3R5cGVzL2ltcG9ydHMuZC50cycsXG4gICAgICBpbXBvcnRzOiBbJ3Z1ZScsICdAdnVldXNlL2NvcmUnLCBWdWVSb3V0ZXJBdXRvSW1wb3J0cywgdW5oZWFkVnVlQ29tcG9zYWJsZXNJbXBvcnRzXSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgYW4gaW50ZXJuYWwgdml0ZSBwbHVnaW4gdGhhdCBsb2FkIG1hcmtkb3duIGZpbGVzIGFzIHZ1ZSBjb21wb25lbnRzLlxuICAgICAqXG4gICAgICogQHNlZSAvZG9jdW1lbnRhdGlvblxuICAgICAqIEBzZWUgL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1xuICAgICAqIEBzZWUgL3NyYy9jb21wb25lbnRzL3BhcnRpYWxzL2RvY3VtZW50YXRpb24vRG9jdW1lbnRhdGlvbkl0ZW0udnVlXG4gICAgICogQHNlZSAvc3JjL2NvbXBvc2FibGUvdXNlTWFya2Rvd25Ub2MudHNcbiAgICAgKi9cbiAgICBWaXRlUGx1Z2luVnVlcm9Eb2Moe1xuICAgICAgcGF0aFByZWZpeDogJ2RvY3VtZW50YXRpb24nLFxuICAgICAgd3JhcHBlckNvbXBvbmVudDogJ0RvY3VtZW50YXRpb25JdGVtJyxcbiAgICAgIHNoaWtpOiB7XG4gICAgICAgIHRoZW1lOiB7XG4gICAgICAgICAgbGlnaHQ6ICdtaW4tbGlnaHQnLFxuICAgICAgICAgIGRhcms6ICdnaXRodWItZGFyaycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc291cmNlTWV0YToge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBlZGl0UHJvdG9jb2w6ICd2c2NvZGU6Ly92c2NvZGUtcmVtb3RlL3dzbCtVYnVudHUnLCAvLyBvciAndnNjb2RlOi8vZmlsZSdcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFuIGludGVybmFsIHZpdGUgcGx1Z2luIHRoYXQgcmVtb3ZlIGh0bWwgY29tbWVudHMgZnJvbSBjb2RlLlxuICAgICAqXG4gICAgICogQHNlZSAvdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHNcbiAgICAgKi9cbiAgICBWaXRlUGx1Z2luUHVyZ2VDb21tZW50cygpLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMgcGx1Z2luIGlzIHJlc3BvbnNpYmxlIG9mIGF1dG9sb2FkaW5nIGNvbXBvbmVudHNcbiAgICAgKiBkb2N1bWVudGF0aW9uIGFuZCBtZCBmaWxlIGFyZSBsb2FkZWQgZm9yIGVsZW1lbnRzIGFuZCBjb21wb25lbnRzIHNlY3Rpb25zXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50c1xuICAgICAqL1xuICAgIENvbXBvbmVudHMoe1xuICAgICAgZGlyczogWydkb2N1bWVudGF0aW9uJywgJ3NyYy9jb21wb25lbnRzJywgJ3NyYy9sYXlvdXRzJ10sXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgICAgZHRzOiAnLi90eXBlcy9jb21wb25lbnRzLmQudHMnLFxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLXB1cmdlLWljb25zIHBsdWdpbiBpcyByZXNwb25zaWJsZSBvZiBhdXRvbG9hZGluZyBpY29uZXMgZnJvbSBtdWx0aXBsZXMgcHJvdmlkZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vaWNvbmVzLm5ldGxpZnkuYXBwL1xuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3B1cmdlLWljb25zL3RyZWUvbWFpbi9wYWNrYWdlcy92aXRlLXBsdWdpbi1wdXJnZS1pY29uc1xuICAgICAqL1xuICAgIFB1cmdlSWNvbnMoKSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLWZvbnRzIHBsdWdpbiBpbmplY3Qgd2ViZm9udHMgZnJvbSBkaWZmZXJlbnRzIHByb3ZpZGVyc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3RhZnluaWFrc2FjaGEvdml0ZS1wbHVnaW4tZm9udHNcbiAgICAgKi9cbiAgICBVbmZvbnRzKHtcbiAgICAgIGdvb2dsZToge1xuICAgICAgICBmYW1pbGllczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdGaXJhIENvZGUnLFxuICAgICAgICAgICAgc3R5bGVzOiAnd2dodEA0MDA7NjAwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdNb250c2VycmF0JyxcbiAgICAgICAgICAgIHN0eWxlczogJ3dnaHRANTAwOzYwMDs3MDA7ODAwOzkwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUm9ib3RvJyxcbiAgICAgICAgICAgIHN0eWxlczogJ3dnaHRAMzAwOzQwMDs1MDA7NjAwOzcwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1yYWRhciBwbHVnaW4gaW5qZWN0IHNuaXBwZXRzIGZyb20gYW5hbHl0aWNzIHByb3ZpZGVyc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3RhZnluaWFrc2FjaGEvdml0ZS1wbHVnaW4tcmFkYXJcbiAgICAgKi9cbiAgICAhcHJvY2Vzcy5lbnYuR1RNX0lEXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiBWaXRlUGx1Z2luUmFkYXIoe1xuICAgICAgICAgIGd0bToge1xuICAgICAgICAgICAgaWQ6IHByb2Nlc3MuZW52LkdUTV9JRCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLXB3YSBnZW5lcmF0ZSBtYW5pZmVzdC5qc29uIGFuZCByZWdpc3RlciBzZXJ2aWNlcyB3b3JrZXIgdG8gZW5hYmxlIFBXQVxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tcHdhXG4gICAgICovXG4gICAgVml0ZVBXQSh7XG4gICAgICBiYXNlOiAnLycsXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uc3ZnJywgJ2Zhdmljb24uaWNvJywgJ3JvYm90cy50eHQnLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdWdWVybyAtIEEgY29tcGxldGUgVnVlIDMgZGVzaWduIHN5c3RlbScsXG4gICAgICAgIHNob3J0X25hbWU6ICdWdWVybycsXG4gICAgICAgIHN0YXJ0X3VybDogJy8/dXRtX3NvdXJjZT1wd2EnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdwd2EtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIG1vZGU6IGlzUHJvZCA/ICdwcm9kdWN0aW9uJyA6ICdkZXZlbG9wbWVudCcsXG4gICAgICAvLyByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIHByZWNhY2hlIGZpbGVzIHRoYXQgbWF0Y2ggdGhlIGdsb2IgcGF0dGVyblxuICAgICAgICAgKlxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vdml0ZS1wd2Etb3JnLm5ldGxpZnkuYXBwL2d1aWRlL3NlcnZpY2Utd29ya2VyLXByZWNhY2hlLmh0bWxcbiAgICAgICAgICovXG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaWNvLHBuZyxzdmcsd2VicCxqcGcsanBlZ30nXSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogYWRkIGV4dGVybmFsIGNhY2hlIG9mIGdvb2dsZSBmb250c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vdml0ZS1wd2Etb3JnLm5ldGxpZnkuYXBwL3dvcmtib3gvZ2VuZXJhdGUtc3cuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1jYWNoZScsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUsIC8vIDw9PSAzNjUgZGF5c1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ3N0YXRpY1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2dzdGF0aWMtZm9udHMtY2FjaGUnLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LCAvLyA8PT0gMzY1IGRheXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogcm9sbHVwLXBsdWdpbi1wdXJnZWNzcyBwbHVnaW4gaXMgcmVzcG9uc2libGUgb2YgcHVyZ2luZyBjc3MgcnVsZXNcbiAgICAgKiB0aGF0IGFyZSBub3QgdXNlZCBpbiB0aGUgYnVuZGxlXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9GdWxsSHVtYW4vcHVyZ2Vjc3MvdHJlZS9tYWluL3BhY2thZ2VzL3JvbGx1cC1wbHVnaW4tcHVyZ2Vjc3NcbiAgICAgKi9cbiAgICBwdXJnZWNzcyh7XG4gICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgY29udGVudDogW2AuL3NyYy8qKi8qLnZ1ZWBdLFxuICAgICAgdmFyaWFibGVzOiBmYWxzZSxcbiAgICAgIHNhZmVsaXN0OiB7XG4gICAgICAgIHN0YW5kYXJkOiBbXG4gICAgICAgICAgLyhhdXR2fGxuaWx8bG5pcnxmYXM/KS8sXG4gICAgICAgICAgLy0obGVhdmV8ZW50ZXJ8YXBwZWFyKSh8LSh0b3xmcm9tfGFjdGl2ZSkpJC8sXG4gICAgICAgICAgL14oPyEofC4qPzopY3Vyc29yLW1vdmUpListbW92ZSQvLFxuICAgICAgICAgIC9ecm91dGVyLWxpbmsofC1leGFjdCktYWN0aXZlJC8sXG4gICAgICAgICAgL2RhdGEtdi0uKi8sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgZGVmYXVsdEV4dHJhY3Rvcihjb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRXaXRob3V0U3R5bGVCbG9ja3MgPSBjb250ZW50LnJlcGxhY2UoLzxzdHlsZVteXSs/PFxcL3N0eWxlPi9naSwgJycpXG4gICAgICAgIHJldHVybiBjb250ZW50V2l0aG91dFN0eWxlQmxvY2tzLm1hdGNoKC9bQS1aYS16MC05LV8vOl0qW0EtWmEtejAtOS1fL10rL2cpIHx8IFtdXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4taW1hZ2VtaW4gb3B0aW1pemUgYWxsIGltYWdlcyBzaXplcyBmcm9tIHB1YmxpYyBvciBhc3NldCBmb2xkZXJcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FubmN3Yi92aXRlLXBsdWdpbi1pbWFnZW1pblxuICAgICAqL1xuICAgICFNSU5JRllfSU1BR0VTXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiBJbWFnZU1pbih7XG4gICAgICAgICAgZ2lmc2ljbGU6IHtcbiAgICAgICAgICAgIG9wdGltaXphdGlvbkxldmVsOiA3LFxuICAgICAgICAgICAgaW50ZXJsYWNlZDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvcHRpcG5nOiB7XG4gICAgICAgICAgICBvcHRpbWl6YXRpb25MZXZlbDogNyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vempwZWc6IHtcbiAgICAgICAgICAgIHF1YWxpdHk6IDYwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcG5ncXVhbnQ6IHtcbiAgICAgICAgICAgIHF1YWxpdHk6IFswLjgsIDAuOV0sXG4gICAgICAgICAgICBzcGVlZDogNCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN2Z286IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdyZW1vdmVWaWV3Qm94JyxcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3JlbW92ZUVtcHR5QXR0cnMnLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICBdLFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hZG5hbi93b3JraW5nX3JlcG8vdGhlbWVmb3Jlc3QtN0RvZWx4RVktdnVlcm8tdnVlanMtMy1hZG1pbi1hbmQtd2ViYXBwLXVpLWtpdC90ZW1wbGF0ZS12dWVyby12Mi44LjEvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4sIFJlc29sdmVkQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB0eXBlIHsgUHJvY2Vzc29yIH0gZnJvbSAndW5pZmllZCdcbmltcG9ydCB0eXBlIHsgVGhlbWUgfSBmcm9tICdzaGlraSdcblxuaW1wb3J0IHsgam9pbiwgYmFzZW5hbWUgfSBmcm9tICdwYXRoZSdcbmltcG9ydCB7IGNvbXBpbGVUZW1wbGF0ZSwgcGFyc2UgfSBmcm9tICdAdnVlL2NvbXBpbGVyLXNmYydcblxuaW1wb3J0IHsgY3JlYXRlUHJvY2Vzc29ycyB9IGZyb20gJy4vbWFya2Rvd24nXG5pbXBvcnQgeyB0cmFuc2Zvcm1FeGFtcGxlTWFya3VwLCB0cmFuc2Zvcm1TbG90cyB9IGZyb20gJy4vdHJhbnNmb3JtJ1xuXG5mdW5jdGlvbiBwYXJzZUlkKGlkOiBzdHJpbmcpIHtcbiAgY29uc3QgaW5kZXggPSBpZC5pbmRleE9mKCc/JylcbiAgaWYgKGluZGV4IDwgMCkgcmV0dXJuIGlkXG4gIGVsc2UgcmV0dXJuIGlkLnNsaWNlKDAsIGluZGV4KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsdWdpbk9wdGlvbnMge1xuICBwYXRoUHJlZml4Pzogc3RyaW5nXG4gIHdyYXBwZXJDb21wb25lbnQ6IHN0cmluZ1xuICBzaGlraToge1xuICAgIHRoZW1lOlxuICAgICAgfCBUaGVtZVxuICAgICAgfCB7XG4gICAgICAgICAgbGlnaHQ6IFRoZW1lXG4gICAgICAgICAgZGFyazogVGhlbWVcbiAgICAgICAgfVxuICB9XG4gIHNvdXJjZU1ldGE/OiB7XG4gICAgZW5hYmxlZD86IGJvb2xlYW5cbiAgICBlZGl0UHJvdG9jb2w/OiBzdHJpbmdcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gVml0ZVBsdWdpblZ1ZXJvRG9jKG9wdGlvbnM6IFBsdWdpbk9wdGlvbnMpIHtcbiAgbGV0IGNvbmZpZzogUmVzb2x2ZWRDb25maWcgfCB1bmRlZmluZWRcbiAgbGV0IHByb2Nlc3NvcnM6IHsgbGlnaHQ6IFByb2Nlc3NvcjsgZGFyazogUHJvY2Vzc29yIH0gfCB1bmRlZmluZWRcblxuICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpXG4gIGNvbnN0IHBhdGhQcmVmaXggPSBvcHRpb25zLnBhdGhQcmVmaXggPyBqb2luKGN3ZCwgb3B0aW9ucy5wYXRoUHJlZml4KSA6IGN3ZFxuXG4gIGFzeW5jIGZ1bmN0aW9uIG1hcmtkb3duVG9WdWUoaWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXRoID0gcGFyc2VJZChpZClcblxuICAgIC8vIHRyYW5zZm9ybSBleGFtcGxlIG1hcmt1cCB0byB1c2Uga2ViYWItY2FzZSB3aXRob3V0IHNlbGYtY2xvc2luZyBlbGVtZW50cy5cbiAgICAvLyB0aGlzIGlzIG5lZWRlZCBiZWNhdXNlIHJlaHlwZS1yYXcgcmVxdWlyZXMgdmFsaWQgaHRtbCAob25seSBzb21lIHRhZ3MgYXJlIHNlbGYtY2xvc2FibGUpXG4gICAgY29uc3QgaW5wdXQgPSB0cmFuc2Zvcm1FeGFtcGxlTWFya3VwKHJhdylcblxuICAgIC8vIHByb2Nlc3MgbWFya2Rvd24gd2l0aCByZW1hcmtcbiAgICBpZiAoIXByb2Nlc3NvcnMpIHByb2Nlc3NvcnMgPSBhd2FpdCBjcmVhdGVQcm9jZXNzb3JzKG9wdGlvbnMuc2hpa2kudGhlbWUpXG5cbiAgICBjb25zdCBbdkZpbGVMaWdodCwgdkZpbGVEYXJrXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHByb2Nlc3NvcnMubGlnaHQucHJvY2VzcyhpbnB1dCksXG4gICAgICBwcm9jZXNzb3JzLmRhcmsucHJvY2VzcyhpbnB1dCksXG4gICAgXSlcblxuICAgIGNvbnN0IGNvbnRlbnRMaWdodCA9IHZGaWxlTGlnaHQudG9TdHJpbmcoKVxuICAgIGNvbnN0IGNvbnRlbnREYXJrID0gdkZpbGVEYXJrLnRvU3RyaW5nKClcbiAgICBjb25zdCBmcm9udG1hdHRlciA9IHZGaWxlTGlnaHQuZGF0YT8uZnJvbnRtYXR0ZXIgPz8ge31cblxuICAgIC8vIHJlcGxhY2UgY29kZS9leGFtcGxlIHNsb3RzIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IHNsb3RMaWdodCA9IHRyYW5zZm9ybVNsb3RzKGNvbnRlbnRMaWdodCwgJ3YtaWY9XCIhZGFya21vZGUuaXNEYXJrXCInKVxuICAgIGNvbnN0IHNsb3REYXJrID0gdHJhbnNmb3JtU2xvdHMoY29udGVudERhcmssICd2LWlmPVwiZGFya21vZGUuaXNEYXJrXCInKVxuXG4gICAgLy8gd3JhcCBjb250ZW50IGluIHdyYXBwZXIgY29tcG9uZW50IGRlZmF1bHQgc2xvdFxuICAgIGNvbnN0IHNmYyA9IFtcbiAgICAgIGA8dGVtcGxhdGU+YCxcbiAgICAgIGAgIDwke29wdGlvbnMud3JhcHBlckNvbXBvbmVudH0gOmZyb250bWF0dGVyPVwiZnJvbnRtYXR0ZXJcIiA6c291cmNlLW1ldGE9XCJzb3VyY2VNZXRhXCI+YCxcbiAgICAgIGAgICAgJHtzbG90TGlnaHR9YCxcbiAgICAgIGAgICAgJHtzbG90RGFya31gLFxuICAgICAgYCAgPC8ke29wdGlvbnMud3JhcHBlckNvbXBvbmVudH0+YCxcbiAgICAgIGA8L3RlbXBsYXRlPmAsXG4gICAgXS5qb2luKCdcXG4nKVxuXG4gICAgLy8gcGFyc2UgdGVtcGxhdGUgd2l0aCB2dWUgc2ZjIGNvbXBpbGVyXG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2Uoc2ZjLCB7XG4gICAgICBmaWxlbmFtZTogcGF0aCxcbiAgICAgIHNvdXJjZU1hcDogdHJ1ZSxcbiAgICB9KVxuXG4gICAgaWYgKHJlc3VsdC5lcnJvcnMubGVuZ3RoIHx8IHJlc3VsdC5kZXNjcmlwdG9yLnRlbXBsYXRlID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcnMpXG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWFya2Rvd246IHVuYWJsZSB0byBwYXJzZSB2aXJ0dWFsIGZpbGUgZ2VuZXJhdGVkIGZvciBcIiR7aWR9XCJgKVxuICAgIH1cblxuICAgIC8vIGNvbXBpbGUgdGVtcGxhdGUgd2l0aCB2dWUgc2ZjIGNvbXBpbGVyXG4gICAgY29uc3QgeyBjb2RlLCBlcnJvcnMgfSA9IGNvbXBpbGVUZW1wbGF0ZSh7XG4gICAgICBmaWxlbmFtZTogcGF0aCxcbiAgICAgIGlkOiBwYXRoLFxuICAgICAgc291cmNlOiByZXN1bHQuZGVzY3JpcHRvci50ZW1wbGF0ZS5jb250ZW50LFxuICAgICAgcHJlcHJvY2Vzc0xhbmc6IHJlc3VsdC5kZXNjcmlwdG9yLnRlbXBsYXRlLmxhbmcsXG4gICAgICB0cmFuc2Zvcm1Bc3NldFVybHM6IGZhbHNlLFxuICAgIH0pXG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcnMpXG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWFya2Rvd246IHVuYWJsZSB0byBjb21waWxlIHZpcnR1YWwgZmlsZSBcIiR7aWR9XCJgKVxuICAgIH1cblxuICAgIC8vIHNvdXJjZSBpcyB1c2VkIHRvIGRpc3BsYXkgZWRpdCBzb3VyY2UgbGluayBpbiB0aGUgZG9jc1xuICAgIGxldCBzb3VyY2VNZXRhID0gJ3VuZGVmaW5lZCdcbiAgICBpZiAob3B0aW9ucy5zb3VyY2VNZXRhPy5lbmFibGVkKSB7XG4gICAgICBzb3VyY2VNZXRhID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICByZWxhdGl2ZVBhdGg6IHBhdGguc3Vic3RyaW5nKGN3ZC5sZW5ndGgpLFxuICAgICAgICBiYXNlbmFtZTogYmFzZW5hbWUocGF0aCksXG4gICAgICAgIHBhdGg6IGNvbmZpZz8uaXNQcm9kdWN0aW9uID8gJycgOiBwYXRoLFxuICAgICAgICBlZGl0UHJvdG9jb2w6IGNvbmZpZz8uaXNQcm9kdWN0aW9uID8gJycgOiBvcHRpb25zLnNvdXJjZU1ldGEuZWRpdFByb3RvY29sLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBpbmplY3QgZnJvbnRtYXR0ZXIvZGFya21vZGUgYW5kIGhtcklkIGludG8gdGhlIGNvbXBpbGVkIHJlbmRlciBmdW5jdGlvblxuICAgIGNvbnN0IG91dHB1dCA9IFtcbiAgICAgIGBpbXBvcnQgeyByZWFjdGl2ZSB9IGZyb20gJ3Z1ZSdgLFxuICAgICAgYGltcG9ydCB7IHVzZURhcmttb2RlIH0gZnJvbSAnL0BzcmMvc3RvcmVzL2Rhcmttb2RlJ2AsXG5cbiAgICAgIGNvZGUucmVwbGFjZSgnZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcicsICdmdW5jdGlvbiByZW5kZXInKSxcblxuICAgICAgYGNvbnN0IF9fZnJvbnRtYXR0ZXIgPSAke0pTT04uc3RyaW5naWZ5KGZyb250bWF0dGVyKX07YCxcbiAgICAgIGBjb25zdCBzZXR1cCA9ICgpID0+ICh7YCxcbiAgICAgIGAgIGZyb250bWF0dGVyOiByZWFjdGl2ZShfX2Zyb250bWF0dGVyKSxgLFxuICAgICAgYCAgZGFya21vZGU6IHVzZURhcmttb2RlKCksYCxcbiAgICAgIGAgIHNvdXJjZU1ldGE6ICR7c291cmNlTWV0YX0sYCxcbiAgICAgIGB9KTtgLFxuICAgICAgYGNvbnN0IF9fc2NyaXB0ID0geyByZW5kZXIsIHNldHVwIH07YCxcblxuICAgICAgY29uZmlnPy5pc1Byb2R1Y3Rpb24gPyAnJyA6IGBfX3NjcmlwdC5fX2htcklkID0gJHtKU09OLnN0cmluZ2lmeShwYXRoKX07YCxcbiAgICAgIGBleHBvcnQgZGVmYXVsdCBfX3NjcmlwdDtgLFxuICAgIF0uam9pbignXFxuJylcblxuICAgIHJldHVybiBvdXRwdXRcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYycsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgY29uZmlnUmVzb2x2ZWQoX2NvbmZpZykge1xuICAgICAgY29uZmlnID0gX2NvbmZpZ1xuICAgIH0sXG4gICAgYXN5bmMgdHJhbnNmb3JtKHJhdywgaWQpIHtcbiAgICAgIGlmIChpZC5lbmRzV2l0aCgnLm1kJykgJiYgaWQuc3RhcnRzV2l0aChwYXRoUHJlZml4KSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgbWFya2Rvd25Ub1Z1ZShpZCwgcmF3KVxuICAgICAgfVxuICAgIH0sXG4gIH0gc2F0aXNmaWVzIFBsdWdpblxufVxuXG5leHBvcnQgZGVmYXVsdCBWaXRlUGx1Z2luVnVlcm9Eb2NcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hZG5hbi93b3JraW5nX3JlcG8vdGhlbWVmb3Jlc3QtN0RvZWx4RVktdnVlcm8tdnVlanMtMy1hZG1pbi1hbmQtd2ViYXBwLXVpLWtpdC90ZW1wbGF0ZS12dWVyby12Mi44LjEvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL21hcmtkb3duLnRzXCI7aW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCdcbmltcG9ydCByZW1hcmtTaGlraSBmcm9tICdAc3RlZmFucHJvYnN0L3JlbWFyay1zaGlraSdcbmltcG9ydCByZWh5cGVFeHRlcm5hbExpbmtzIGZyb20gJ3JlaHlwZS1leHRlcm5hbC1saW5rcydcbmltcG9ydCByZWh5cGVSYXcgZnJvbSAncmVoeXBlLXJhdydcbmltcG9ydCByZWh5cGVTbHVnIGZyb20gJ3JlaHlwZS1zbHVnJ1xuaW1wb3J0IHJlaHlwZUF1dG9saW5rSGVhZGluZ3MgZnJvbSAncmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzJ1xuaW1wb3J0IHJlaHlwZVN0cmluZ2lmeSBmcm9tICdyZWh5cGUtc3RyaW5naWZ5J1xuaW1wb3J0IHJlbWFya1BhcnNlIGZyb20gJ3JlbWFyay1wYXJzZSdcbmltcG9ydCByZW1hcmtHZm0gZnJvbSAncmVtYXJrLWdmbSdcbmltcG9ydCByZW1hcmtSZWh5cGUgZnJvbSAncmVtYXJrLXJlaHlwZSdcbmltcG9ydCByZW1hcmtGcm9udG1hdHRlciBmcm9tICdyZW1hcmstZnJvbnRtYXR0ZXInXG5pbXBvcnQgeyBnZXRIaWdobGlnaHRlciwgdHlwZSBJVGhlbWVSZWdpc3RyYXRpb24sIHR5cGUgTGFuZywgdHlwZSBUaGVtZSB9IGZyb20gJ3NoaWtpJ1xuaW1wb3J0IHsgdW5pZmllZCwgdHlwZSBQcm9jZXNzb3IgfSBmcm9tICd1bmlmaWVkJ1xuXG5jb25zdCBsYW5ncyA9IFsndnVlJywgJ3Z1ZS1odG1sJywgJ3R5cGVzY3JpcHQnLCAnYmFzaCcsICdzY3NzJ10gc2F0aXNmaWVzIExhbmdbXVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJvY2Vzc29yKHRoZW1lOiBJVGhlbWVSZWdpc3RyYXRpb24pOiBQcm9taXNlPFByb2Nlc3Nvcj4ge1xuICBjb25zdCBoaWdobGlnaHRlciA9IGF3YWl0IGdldEhpZ2hsaWdodGVyKHtcbiAgICB0aGVtZSxcbiAgICBsYW5ncyxcbiAgfSlcblxuICByZXR1cm4gdW5pZmllZCgpXG4gICAgLnVzZShyZW1hcmtQYXJzZSlcbiAgICAudXNlKHJlbWFya0Zyb250bWF0dGVyKVxuICAgIC51c2UoKCkgPT4gKHRyZWUsIGZpbGUpID0+IHtcbiAgICAgIGlmICh0cmVlLmNoaWxkcmVuWzBdLnR5cGUgPT09ICd5YW1sJykge1xuICAgICAgICAvLyBzdG9yZSBmcm9udG1hdHRlciBpbiB2ZmlsZVxuICAgICAgICBmaWxlLmRhdGEuZnJvbnRtYXR0ZXIgPSB5YW1sLmxvYWQodHJlZS5jaGlsZHJlblswXS52YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIC51c2UocmVtYXJrR2ZtKVxuICAgIC51c2UocmVtYXJrU2hpa2ksIHsgaGlnaGxpZ2h0ZXIgfSlcbiAgICAudXNlKHJlbWFya1JlaHlwZSwgeyBhbGxvd0Rhbmdlcm91c0h0bWw6IHRydWUgfSlcbiAgICAudXNlKHJlaHlwZVJhdylcbiAgICAudXNlKHJlaHlwZUV4dGVybmFsTGlua3MsIHsgcmVsOiBbJ25vZm9sbG93J10sIHRhcmdldDogJ19ibGFuaycgfSlcbiAgICAudXNlKHJlaHlwZVNsdWcpXG4gICAgLnVzZShyZWh5cGVBdXRvbGlua0hlYWRpbmdzLCB7XG4gICAgICBiZWhhdmlvcjogJ2FwcGVuZCcsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHR5cGU6ICdlbGVtZW50JyxcbiAgICAgICAgdGFnTmFtZTogJ2knLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgY2xhc3NOYW1lOiBbJ2ljb25pZnkgdG9jLWxpbmstYW5jaG9yJ10sXG4gICAgICAgICAgZGF0YUljb246ICdmZWF0aGVyOmxpbmsnLFxuICAgICAgICB9LFxuICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICB9LFxuICAgICAgdGVzdDogKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIEFycmF5LmlzQXJyYXkobm9kZS5wcm9wZXJ0aWVzPy5jbGFzc05hbWUpICYmXG4gICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzPy5jbGFzc05hbWU/LmluY2x1ZGVzKCd0b2MtaWdub3JlJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJvb2xlYW4obm9kZS5wcm9wZXJ0aWVzPy5pZClcbiAgICAgIH0sXG4gICAgfSlcbiAgICAudXNlKHJlaHlwZVN0cmluZ2lmeSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVByb2Nlc3NvcnMoXG4gIHRoZW1lOlxuICAgIHwgVGhlbWVcbiAgICB8IHtcbiAgICAgICAgbGlnaHQ6IFRoZW1lXG4gICAgICAgIGRhcms6IFRoZW1lXG4gICAgICB9XG4pOiBQcm9taXNlPHsgbGlnaHQ6IFByb2Nlc3NvcjsgZGFyazogUHJvY2Vzc29yIH0+IHtcbiAgcmV0dXJuIHtcbiAgICBsaWdodDogYXdhaXQgY3JlYXRlUHJvY2Vzc29yKHR5cGVvZiB0aGVtZSA9PT0gJ3N0cmluZycgPyB0aGVtZSA6IHRoZW1lLmxpZ2h0KSxcbiAgICBkYXJrOiBhd2FpdCBjcmVhdGVQcm9jZXNzb3IodHlwZW9mIHRoZW1lID09PSAnc3RyaW5nJyA/IHRoZW1lIDogdGhlbWUuZGFyayksXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy90cmFuc2Zvcm0udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy90cmFuc2Zvcm0udHNcIjtpbXBvcnQgeyBrZWJhYkNhc2UgfSBmcm9tICdzY3VsZSdcblxuY29uc3QgU0VMRl9DTE9TSU5HX1RBR19SRUdFWCA9IC88KFteXFxzPjwvXSspKFtePl0rKVxcLz4vZ1xuY29uc3QgT1BFTl9UQUdfUkVHRVggPSAvPChbXlxccz48L10rKS9nXG5jb25zdCBDTE9TRV9UQUdfUkVHRVggPSAvPFxcLyhbXlxccz48L10rKS9nXG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1FeGFtcGxlTWFya3VwKHJhdzogc3RyaW5nKSB7XG4gIGxldCBvdXRwdXQgPSByYXdcbiAgbGV0IGNvbnRlbnQ6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gbnVsbFxuICBpZiAoKGNvbnRlbnQgPSByYXcubWF0Y2goLzwhLS1leGFtcGxlLS0+KFtcXHNcXFNdKj8pPCEtLVxcL2V4YW1wbGUtLT4vKSkpIHtcbiAgICBjb25zdCBrZWJhYkNvbnRlbnQgPSBjb250ZW50WzFdXG4gICAgICAucmVwbGFjZUFsbChTRUxGX0NMT1NJTkdfVEFHX1JFR0VYLCAoc3Vic3RyaW5nLCB0YWcpID0+IHtcbiAgICAgICAgcmV0dXJuIHN1YnN0cmluZy5yZXBsYWNlKCcvPicsIGA+PC8ke3RhZy50cmltKCl9PmApXG4gICAgICB9KVxuICAgICAgLnJlcGxhY2VBbGwoT1BFTl9UQUdfUkVHRVgsIChzdWJzdHJpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIGA8JHtrZWJhYkNhc2Uoc3Vic3RyaW5nLnN1YnN0cmluZygxKS50cmltKCkpfWBcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZUFsbChDTE9TRV9UQUdfUkVHRVgsIChzdWJzdHJpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIGA8LyR7a2ViYWJDYXNlKHN1YnN0cmluZy5zdWJzdHJpbmcoMikudHJpbSgpKX1gXG4gICAgICB9KVxuICAgICAgLnJlcGxhY2VBbGwoJyYjeDI3OycsIFwiJ1wiKVxuXG4gICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoY29udGVudFsxXSwga2ViYWJDb250ZW50KVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtU2xvdHMoc291cmNlOiBzdHJpbmcsIGNvbmRpdGlvbjogc3RyaW5nID0gJycpIHtcbiAgaWYgKHNvdXJjZS5pbmNsdWRlcygnPCEtLWNvZGUtLT4nKSAmJiBzb3VyY2UuaW5jbHVkZXMoJzwhLS1leGFtcGxlLS0+JykpIHtcbiAgICByZXR1cm4gYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2RlZmF1bHQ+JHtzb3VyY2V9YFxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tY29kZS0tPmAsXG4gICAgICAgIGA8L3RlbXBsYXRlPjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2NvZGU+XFxuPHNsb3QgbmFtZT1cImNvZGVcIj48ZGl2IHYtcHJlPmBcbiAgICAgIClcbiAgICAgIC5yZXBsYWNlKGA8IS0tL2NvZGUtLT5gLCBgPC9kaXY+PC9zbG90PlxcbjwvdGVtcGxhdGU+YClcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLWV4YW1wbGUtLT5gLFxuICAgICAgICBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZXhhbXBsZT5cXG48c2xvdCBuYW1lPVwiZXhhbXBsZVwiPmBcbiAgICAgIClcbiAgICAgIC5yZXBsYWNlKGA8IS0tL2V4YW1wbGUtLT5gLCBgPC9zbG90PlxcbjwvdGVtcGxhdGU+YClcbiAgfVxuXG4gIGlmIChzb3VyY2UuaW5jbHVkZXMoJzwhLS1jb2RlLS0+JykpIHtcbiAgICByZXR1cm4gYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2RlZmF1bHQ+JHtzb3VyY2V9YFxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tY29kZS0tPmAsXG4gICAgICAgIGA8L3RlbXBsYXRlPjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2NvZGU+XFxuPHNsb3QgbmFtZT1cImNvZGVcIj48ZGl2IHYtcHJlPmBcbiAgICAgIClcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLS9jb2RlLS0+YCxcbiAgICAgICAgYDwvZGl2Pjwvc2xvdD5cXG48L3RlbXBsYXRlPlxcbjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+PHNsb3QgbmFtZT1cImV4YW1wbGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gXG4gICAgICApXG4gIH1cblxuICBpZiAoc291cmNlLmluY2x1ZGVzKCc8IS0tZXhhbXBsZS0tPicpKSB7XG4gICAgcmV0dXJuIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfWBcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLWV4YW1wbGUtLT5gLFxuICAgICAgICBgPC90ZW1wbGF0ZT48dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPlxcbjxzbG90IG5hbWU9XCJleGFtcGxlXCI+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tL2V4YW1wbGUtLT5gLFxuICAgICAgICBgPC9zbG90PlxcbjwvdGVtcGxhdGU+XFxuPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT48c2xvdCBuYW1lPVwiY29kZVwiPjwvc2xvdD48L3RlbXBsYXRlPmBcbiAgICAgIClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2RlZmF1bHQ+JHtzb3VyY2V9PC90ZW1wbGF0ZT5gICtcbiAgICBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZXhhbXBsZT48c2xvdCBuYW1lPVwiZXhhbXBsZVwiPjwvc2xvdD48L3RlbXBsYXRlPmAgK1xuICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPjxzbG90IG5hbWU9XCJjb2RlXCI+PC9zbG90PjwvdGVtcGxhdGU+YFxuICApXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FkbmFuL3dvcmtpbmdfcmVwby90aGVtZWZvcmVzdC03RG9lbHhFWS12dWVyby12dWVqcy0zLWFkbWluLWFuZC13ZWJhcHAtdWkta2l0L3RlbXBsYXRlLXZ1ZXJvLXYyLjguMS92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYWRuYW4vd29ya2luZ19yZXBvL3RoZW1lZm9yZXN0LTdEb2VseEVZLXZ1ZXJvLXZ1ZWpzLTMtYWRtaW4tYW5kLXdlYmFwcC11aS1raXQvdGVtcGxhdGUtdnVlcm8tdjIuOC4xL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2FkbmFuL3dvcmtpbmdfcmVwby90aGVtZWZvcmVzdC03RG9lbHhFWS12dWVyby12dWVqcy0zLWFkbWluLWFuZC13ZWJhcHAtdWkta2l0L3RlbXBsYXRlLXZ1ZXJvLXYyLjguMS92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50cy9pbmRleC50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSdcbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnXG5cbmZ1bmN0aW9uIHBhcnNlSWQoaWQ6IHN0cmluZykge1xuICBjb25zdCBpbmRleCA9IGlkLmluZGV4T2YoJz8nKVxuICBpZiAoaW5kZXggPCAwKSByZXR1cm4gaWRcbiAgZWxzZSByZXR1cm4gaWQuc2xpY2UoMCwgaW5kZXgpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGx1Z2luT3B0aW9ucyB7XG4gIHNvdXJjZW1hcD86IGJvb2xlYW5cbn1cblxuLyoqXG4gKiBUaGlzIHBsdWdpbiByZW1vdmVzIEhUTUwgY29tbWVudHMgZnJvbSB5b3VyIGNvZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBWaXRlUGx1Z2luUHVyZ2VDb21tZW50cyh7IHNvdXJjZW1hcCA9IGZhbHNlIH06IFBsdWdpbk9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdwdXJnZS1jb21tZW50cycsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgdHJhbnNmb3JtOiAoY29kZSwgaWQpID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZElkID0gcGFyc2VJZChpZClcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBwYXJzZWRJZC5lbmRzV2l0aCgnLnZ1ZScpIHx8XG4gICAgICAgICAgcGFyc2VkSWQuZW5kc1dpdGgoJy5odG1sJykgfHxcbiAgICAgICAgICBwYXJzZWRJZC5lbmRzV2l0aCgnLnN2ZycpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmICghY29kZS5pbmNsdWRlcygnPCEtLScpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBzID0gbmV3IE1hZ2ljU3RyaW5nKGNvZGUpXG4gICAgICBzLnJlcGxhY2UoLzwhLS1bXFx3XFxXXFxzXSo/LS0+L2csICcnKVxuXG4gICAgICBpZiAocy5oYXNDaGFuZ2VkKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb2RlOiBzLnRvU3RyaW5nKCksXG4gICAgICAgICAgbWFwOiBzb3VyY2VtYXAgJiYgKHMuZ2VuZXJhdGVNYXAoeyBzb3VyY2U6IGlkLCBpbmNsdWRlQ29udGVudDogdHJ1ZSB9KSBhcyBhbnkpLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfSBzYXRpc2ZpZXMgUGx1Z2luXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZlLFNBQVMsU0FBUyxlQUFlO0FBQzlnQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIs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QUFBLGNBQ25CO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZO0FBQUEsZ0JBQ1YsWUFBWTtBQUFBLGdCQUNaLGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLGNBQ2hDO0FBQUEsY0FDQSxtQkFBbUI7QUFBQSxnQkFDakIsVUFBVSxDQUFDLEdBQUcsR0FBRztBQUFBLGNBQ25CO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBUUQsU0FBUztBQUFBLE1BQ1AsUUFBUTtBQUFBLE1BQ1IsU0FBUyxDQUFDLGdCQUFnQjtBQUFBLE1BQzFCLFdBQVc7QUFBQSxNQUNYLFVBQVU7QUFBQSxRQUNSLFVBQVU7QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxpQkFBaUIsU0FBUztBQUN4QixjQUFNLDRCQUE0QixRQUFRLFFBQVEsMEJBQTBCLEVBQUU7QUFDOUUsZUFBTywwQkFBMEIsTUFBTSxrQ0FBa0MsS0FBSyxDQUFDO0FBQUEsTUFDakY7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPRCxDQUFDLGdCQUNHLFNBQ0EsU0FBUztBQUFBLE1BQ1AsVUFBVTtBQUFBLFFBQ1IsbUJBQW1CO0FBQUEsUUFDbkIsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLG1CQUFtQjtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsU0FBUyxDQUFDLEtBQUssR0FBRztBQUFBLFFBQ2xCLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixRQUFRO0FBQUEsVUFDVjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDUDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhcnNlSWQiXQp9Cg==
