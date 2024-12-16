import { CheckIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import React, { type FC } from "react";
import styled from "styled-components";
import { t } from "ttag";

const ImageCriteriaList = styled.ul`
    list-style: none;
    padding: 0;

    .image-criteria-list__list-item {
      img { 
        max-width: 100%;
      }
    }
    
    .image-criteria-list__icon {
      fill: var(--green-a10);
      stroke: var(--green-a10);
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
    }

    .image-criteria-list__heading {
      margin: 0;
      font-size: 1rem;
    }
    
    .image-criteria-list__pictogram {
      margin: 0;
      
      & > figcaption {
        text-align: center;
      }
    }
  `;

export const ImageUploadCriteriaList: FC = () => {
  return (
    <Flex asChild direction="column" gap="2">
      <ImageCriteriaList>
        <Card asChild>
          <li className="image-criteria-list__list-item">
            <Flex gap="2">
              <CheckIcon className="image-criteria-list__icon" />
              <Box>
                <h3 className="image-criteria-list__heading">
                  {t`It contains useful information on accessibility.`}
                </h3>
                <Text color="gray">
                  {t`For example by showing entrances, toilets or a map of the site.`}
                </Text>
                <Grid columns="3" gap="2" mt="3">
                  <figure class="image-criteria-list__pictogram">
                    <img
                      src="/images/photo-upload/entrancePlaceholder.png"
                      alt="A pictogram of an entrance"
                    />
                    <Text color="gray" asChild>
                      <figcaption>{t`Entrance`}</figcaption>
                    </Text>
                  </figure>
                  <figure class="image-criteria-list__pictogram">
                    <img
                      src="/images/photo-upload/toiletPlaceholder.png"
                      alt="A pictogram of a toilet"
                    />
                    <Text color="gray" asChild>
                      <figcaption>{t`Toilet`}</figcaption>
                    </Text>
                  </figure>
                  <figure class="image-criteria-list__pictogram">
                    <img
                      src="/images/photo-upload/sitemapPlaceholder.png"
                      alt="A topdown view showing navigational information"
                    />
                    <Text color="gray" asChild>
                      <figcaption>{t`Site map`}</figcaption>
                    </Text>
                  </figure>
                </Grid>
              </Box>
            </Flex>
          </li>
        </Card>
        <Card asChild>
          <li className="image-criteria-list__list-item">
            <Flex gap="2">
              <CheckIcon className="image-criteria-list__icon" />
              <h3 className="image-criteria-list__heading">
                {t`Was taken by me.`}
              </h3>
            </Flex>
            <Text color="gray">
              {t`By uploading this image, I hereby publish it in the public domain as renounce copyright protection.`}
              &nbsp;
              <a
                href="https://creativecommons.org/publicdomain/zero/1.0/"
                target="_blank"
                rel="noreferrer"
              >
                ({t`CC0 1.0 Universal license`})
              </a>
            </Text>
          </li>
        </Card>
        <Card asChild>
          <li className="image-criteria-list__list-item">
            <Flex gap="2">
              <CheckIcon className="image-criteria-list__icon" />
              <h3 className="image-criteria-list__heading">
                {t`Doesn't show identifiable persons.`}
              </h3>
            </Flex>
          </li>
        </Card>
      </ImageCriteriaList>
    </Flex>
  );
};
