import type { LayerSpecification } from "mapbox-gl";
import { fallbackLanguageTag } from "~/modules/i18n/i18n";
import { getLanguage } from "~/modules/i18n/utils/language-tags";

export function addLabelInOriginalLanguage(
  layers: LayerSpecification[],
  currentLanguage?: string,
  darkMode?: boolean,
): LayerSpecification[] {
  const fallbackLanguage = getLanguage(fallbackLanguageTag);

  return layers.map((layer) => {
    return JSON.parse(
      JSON.stringify(layer).replace(
        '["get","name"]',
        `
            [
              "let",

              "user_language_name", [ "coalesce", ["get", "name:${currentLanguage ?? fallbackLanguage}"], ["get", "name:${fallbackLanguage}"]],
              "local_name", ["coalesce", ["get", "loc_name"], ["get", "name"]],
              "default_fallback_language_name", ["get", "name:en"],

              [
                "let",
                "prio0", ["coalesce", ["var", "user_language_name"], ["var", "local_name"], ["var", "default_fallback_language_name"]],
                "prio1", ["coalesce", ["var", "local_name"], ["var", "default_fallback_language_name"]],
                "prio2", ["coalesce", ["var", "default_fallback_language_name"]],
                [
                  "format",
                  ["coalesce", ["var", "prio0"], ["var", "prio1"], ["var", "prio2"], ""],
                  {},
                  "\\n",
                  {},
                  ["case",
                    ["!=",
                      ["coalesce", ["var", "prio0"], ["var", "prio1"], ["var", "prio2"]],
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]]
                    ],
                    ["coalesce", ["var", "prio1"], ["var", "prio2"], ""],
                    ["!=",
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]],
                      ["var", "prio1"]
                    ],
                    ["var", "prio1"],
                    ["!=",
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]],
                      ["var", "prio2"]
                    ],
                    ["var", "prio2"],
                    ""
                  ],
                  {"font-scale": 0.9, "text-color": "${darkMode ? "rgb(255,255,255)" : "rgba(0,0,0,0.7)"}" }
                ]
              ]
            ]
          `,
      ),
    ) as LayerSpecification;
  });
}
