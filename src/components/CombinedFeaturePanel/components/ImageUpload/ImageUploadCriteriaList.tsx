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
import React, { type FC, useContext } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";

const CriteriaList = styled.ul`
    list-style: none;
    padding: 0;
`;

const CriteriaListItem = styled.li`
  img { max-width: 100%; }
`;

const CriteriaListIcon = styled(CheckIcon)`
  fill: var(--green-a10);
  stroke: var(--green-a10);
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const CriteriaListPictogram = styled.figure`
  margin: 0;
  & > figcaption {
    text-align: center;
  }
`;

const CriteriaListHeading = styled.header`
  margin: 0;
  font-size: 1rem;
`;

export const ImageUploadCriteriaList: FC = () => {
  const { nextStep, close } = useContext(ImageUploadContext);

  return (
    <>
      <Text as="p">
        {t`Before uploading a new image, please make sure that the image meets the following criteria:`}
      </Text>

      <Flex asChild direction="column" gap="2">
        <CriteriaList>
          <Card asChild>
            <CriteriaListItem>
              <Flex gap="2" align="center">
                <CriteriaListIcon aria-hidden />
                <CriteriaListHeading>
                  {t`It contains useful information on accessibility.`}
                </CriteriaListHeading>
              </Flex>
              <Box>
                <Text color="gray">
                  {t`For example by showing entrances, toilets or a map of the site.`}
                </Text>
                <Grid columns="3" gap="2" mt="3" aria-hidden>
                  <CriteriaListPictogram>
                    <img
                      src="/images/photo-upload/entrancePlaceholder.png"
                      alt="A pictogram of an entrance"
                    />
                    <Text color="gray" asChild>
                      <figcaption>{t`Entrance`}</figcaption>
                    </Text>
                  </CriteriaListPictogram>
                  <CriteriaListPictogram>
                    <img
                      src="/images/photo-upload/toiletPlaceholder.png"
                      alt="A pictogram of a toilet"
                    />
                    <Text color="gray" asChild>
                      <figcaption>{t`Toilet`}</figcaption>
                    </Text>
                  </CriteriaListPictogram>
                  <CriteriaListPictogram>
                    <img
                      src="/images/photo-upload/sitemapPlaceholder.png"
                      alt="A topdown view showing navigational information"
                    />
                    <Text color="gray" asChild>
                      <figcaption>{t`Site map`}</figcaption>
                    </Text>
                  </CriteriaListPictogram>
                </Grid>
              </Box>
            </CriteriaListItem>
          </Card>
          <Card asChild>
            <CriteriaListItem className="image-criteria-list__list-item">
              <Flex gap="2">
                <CriteriaListIcon aria-hidden />
                <CriteriaListHeading>
                  {t`It was taken by me.`}
                </CriteriaListHeading>
              </Flex>
              <Text color="gray">
                {t`By uploading this image, I hereby publish it in the public domain as renounce copyright protection: `}
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
                <VisuallyHidden id="image-upload-license-link-description">
                  {t`This link opens in a new window.`}
                </VisuallyHidden>
              </Text>
            </CriteriaListItem>
          </Card>
          <Card asChild>
            <CriteriaListItem>
              <Flex gap="2">
                <CriteriaListIcon aria-hidden />
                <CriteriaListHeading>
                  {t`It doesn't show identifiable persons.`}
                </CriteriaListHeading>
              </Flex>
            </CriteriaListItem>
          </Card>
        </CriteriaList>
      </Flex>

      <Flex justify="between">
        <Button variant="soft" color="gray" size="3" onClick={close}>
          {t`Cancel`}
        </Button>
        <Button size="3" onClick={nextStep}>
          {t`Continue`}
        </Button>
      </Flex>
    </>
  );
};
