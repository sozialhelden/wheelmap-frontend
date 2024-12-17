import { CheckIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Text,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes";
import React, { type FC } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";

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

export const ImageUploadCriteriaList: FC<{ uploadUrl: string }> = ({
  uploadUrl,
}) => {
  return (
    <>
      <Text as="p">
        {t`Before uploading a new image, please make sure that the image meets the following criteria:`}
      </Text>

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
                &nbsp; (
                <Tooltip content={t`This link opens in a new window.`}>
                  <Flex display="inline-flex" align="center" gap="1">
                    <a
                      href="https://creativecommons.org/publicdomain/zero/1.0/"
                      target="_blank"
                      rel="noreferrer"
                      aria-describedby="image-upload-license-link-description"
                    >
                      {t`CC0 1.0 Universal license`}
                    </a>

                    <ExternalLinkIcon aria-hidden />
                  </Flex>
                </Tooltip>
                )
                <VisuallyHidden id="image-upload-license-link-description">
                  {t`This link opens in a new window.`}
                </VisuallyHidden>
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

      <Flex justify="between">
        <Button variant="soft" color="gray" size="3" onClick={close}>
          {t`Cancel`}
        </Button>
        <Button size="3" asChild>
          <AppStateLink
            href={{
              pathname: uploadUrl,
              query: {
                step: 2,
              },
            }}
          >
            {t`Continue`}
          </AppStateLink>
        </Button>
      </Flex>
    </>
  );
};
