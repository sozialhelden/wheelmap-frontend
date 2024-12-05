/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  FC, KeyboardEventHandler, useContext, useMemo,
} from 'react'
import {
  FloatingOverlay, useFloating, useDismiss, useRole, useInteractions, FloatingPortal, FloatingFocusManager,
} from '@floating-ui/react'
import styled from 'styled-components'
import { t } from 'ttag'
import { AccessibilityCloudImage } from '../../../../lib/model/ac/Feature'
import colors from '../../../../lib/util/colors'

import { fullScreenSizes, makeSrcSet, makeSrcSetLocation } from './util'
import useAccessibilityCloudAPI from '../../../../lib/fetchers/ac/useAccessibilityCloudAPI'
import { AppStateLink } from '../../../App/AppStateLink'
import { FeaturePanelContext } from '../../FeaturePanelContext'

const StyledFloatingOverlay = styled(FloatingOverlay)`
  backdrop-filter: blur(5px) brightness(40%);
  color: ${colors.textColor};
  isolation: isolate;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  > div {
    > .image {
      max-height: 80vh;
      max-width: 80vw;
    }
  }

  > .controls {
      background-color: ${colors.neutralBackgroundColorTransparent};
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      position: absolute;
      padding: 16px 32px 16px 32px;
      bottom: 0;
      margin: auto;
      display: flex;
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #ffffff;

      > .legend {
        display: flex;
        gap: 8px;
        > button, > a {
          padding: 4px 8px;
        }
      }
    }

`

export const GalleryOverlay: FC<{
  openIndex: number,
  images: AccessibilityCloudImage[],
  setGalleryIndex: (index: number) => unknown
}> = ({ openIndex, images, setGalleryIndex }) => {
  const open = openIndex > -1
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
  const { baseUrl } = useAccessibilityCloudAPI({ cached: true })

  const { closeGallery, next, previous } = useMemo(() => ({
    closeGallery: () => setGalleryIndex(-1),
    next: () => {
      const newIndex = openIndex + 1
      if (newIndex < images.length) {
        setGalleryIndex(newIndex)
      }
    },
    previous: () => {
      const newIndex = openIndex - 1
      if (newIndex > -1) {
        setGalleryIndex(newIndex)
      }
    },
  }), [images.length, openIndex, setGalleryIndex])

  const { refs, context: ctx } = useFloating({
    open,
    onOpenChange: closeGallery,
  })

  const dismiss = useDismiss(ctx, {
    outsidePressEvent: 'click',
    outsidePress: (event) => {
      // looking if the click hit the control panel in some way
      const wasControls = (event?.target
        && 'closest' in event.target
        && typeof event.target.closest === 'function'
        && event?.target?.closest('.controls'))
      return !wasControls
    },
  })
  const role = useRole(ctx)

  const { getFloatingProps } = useInteractions([dismiss, role])

  const image = images[openIndex]
  if (!image) {
    return null
  }

  const keyHandler: KeyboardEventHandler<HTMLDivElement> = (evt) => {
    if (evt.key === 'ArrowLeft') {
      previous()
      return
    }
    if (evt.key === 'ArrowRight') {
      next()
    }
  }

  if (!baseUrl || !open) {
    return null
  }

  return (
    <FloatingPortal>
      <StyledFloatingOverlay
        lockScroll
        onKeyDown={keyHandler}
      >
        <FloatingFocusManager context={ctx}>
          <>
            <div
              ref={refs.setFloating}
              aria-label={t`Image Gallery`}
              {...getFloatingProps}
            >
              <img
                className="image"
                srcSet={makeSrcSetLocation(makeSrcSet(baseUrl, fullScreenSizes, image))}
                onClick={closeGallery}
                onKeyDown={closeGallery}
              />
            </div>
            <div className="controls">
              <div className="legend">
                <button type="button" onClick={closeGallery}>esc</button>
                <button type="button" disabled={openIndex <= 0} onClick={() => setGalleryIndex(openIndex - 1)}>&lt;-</button>
                <button
                  type="button"
                  disabled={openIndex >= (images.length - 1)}
                  onClick={(evt) => { evt.stopPropagation(); evt.preventDefault(); setGalleryIndex(openIndex + 1) }}
                >
                  -&gt;
                </button>
                <AppStateLink href={`${baseFeatureUrl}/images/${image._id}/report`}>{t`Report image`}</AppStateLink>
              </div>
              <div>{t`Image ${openIndex + 1} / ${images.length}`}</div>
            </div>
          </>
        </FloatingFocusManager>
      </StyledFloatingOverlay>
    </FloatingPortal>
  )
}
