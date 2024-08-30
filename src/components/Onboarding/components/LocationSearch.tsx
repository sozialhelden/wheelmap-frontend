import {
  FC, useContext, useMemo, useRef, useState,
} from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  FloatingFocusManager,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react'
import useSWR from 'swr'
import { FeatureCollection, Point } from 'geojson'
import { center as turfCenter } from '@turf/turf'
import fetchPlacesOnKomootPhoton, { KomootPhotonResultFeature } from '../../../lib/fetchers/fetchPlacesOnKomootPhoton'
import { CallToActionButton } from '../../shared/Button'
import { SearchConfirmText, SearchSkipText } from '../language'
import CountryContext from '../../../lib/context/CountryContext'
import fetchCountryGeometry from '../../../lib/fetchers/fetchCountryGeometry'

export const LocationSearch: FC<{ onUserSelection: (selection?: KomootPhotonResultFeature) => unknown }> = ({ onUserSelection }) => {
  const [{ value, origin, selection }, setValue] = useState({ value: '', origin: 'system', selection: '' })

  const region = useContext(CountryContext)
  const { data: regionGeometry } = useSWR<FeatureCollection>({ }, fetchCountryGeometry)
  const bias = useMemo(() => {
    if (!regionGeometry) {
      return undefined
    }

    const location = regionGeometry.features.find((x) => x.properties['ISO3166-1'] === region)

    let center: Point
    if ('centroid' in location) {
      center = location.centroid as Point
    } else {
      center = turfCenter(location).geometry
    }
    const computedBias = {
      lon: center.coordinates[0].toString(),
      lat: center.coordinates[1].toString(),
      zoom: '5',
      location_bias_scale: '1.0',
    } as const
    return computedBias
  }, [regionGeometry, region])

  const { data } = useSWR({ query: value, additionalQueryParameters: { layer: 'city', ...bias } }, fetchPlacesOnKomootPhoton)
  const filteredData = useMemo(() => {
    if (!data) {
      return []
    }
    const bucket: ({key: string} & KomootPhotonResultFeature)[] = []
    for (let i = 0; i < data.features.length; i += 1) {
      const entry = data.features[i]
      if (!entry.properties) {
        continue
      }
      const key = `${entry.properties.city ?? entry.properties.name} / ${entry.properties.country}`
      if (bucket.some((x) => x.key === key)) {
        continue
      }
      bucket.push({
        key,
        ...entry,
      })
    }
    return bucket
  }, [data])

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            minWidth: `${rects.reference.width}px`,
          })
        },
        padding: 10,
      }),
    ],
  })

  const listRef = useRef<Array<HTMLElement | null>>([])
  const isTypingRef = useRef(false)

  const click = useClick(context, { event: 'mousedown' })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    // This is a large list, allow looping.
    loop: true,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [dismiss, role, listNav, click],
  )

  const handleSelect = (index: number) => {
    const { key } = filteredData[index]
    if (selectedIndex === index) {
      setValue({ value: key, origin: 'selection', selection: key })
      setSelectedIndex(-1)
      return
    }

    setValue({ value, origin, selection: key })
    setSelectedIndex(index)
  }

  return (
    <>
      <input
        placeholder="Location"
        value={value}
        onChange={(e) => { setValue({ value: e.target.value, origin: 'user', selection: '' }) }}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            evt.preventDefault()
            handleSelect(0)
          }
        }}
        {...getReferenceProps()}
        ref={refs.setReference}
      />
      <CallToActionButton onClick={() => { onUserSelection(filteredData.find((x) => x.key === selection)) }}>
        { selection.length > 0 ? SearchConfirmText : SearchSkipText }
      </CallToActionButton>
      {data && origin === 'user' && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                overflowY: 'auto',
                background: '#eee',
                minWidth: 100,
                borderRadius: 8,
                outline: 0,
                zIndex: 10000,
              }}
              {...getFloatingProps()}
            >
              {filteredData.map((feature, i) => (
                <div
                  key={feature.key}
                  ref={(node) => {
                    listRef.current[i] = node
                  }}
                  role="option"
                  tabIndex={i === activeIndex ? 0 : -1}
                  aria-selected={i === selectedIndex && i === activeIndex}
                  style={{
                    padding: 10,
                    cursor: 'default',
                    zIndex: 10001,
                  }}
                  {...getItemProps({
                    // Handle pointer select.
                    onClick() {
                      handleSelect(i)
                    },
                    // Handle keyboard select.
                    onKeyDown(evt) {
                      if (evt.key === 'Enter') {
                        evt.preventDefault()
                        handleSelect(i)
                      }

                      if (evt.key === ' ' && !isTypingRef.current) {
                        evt.preventDefault()
                        handleSelect(i)
                      }
                    },
                  })}
                >
                  {feature.key}
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      right: 10,
                      zIndex: 10002,
                    }}
                  >
                    {i === selectedIndex ? ' ✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}
