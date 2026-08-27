import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { markTrustedHandoff } from './PasswordGate'
import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
  Table,
  Tag,
  Button,
  Link,
  Search,
  Pagination,
  ContentSwitch,
  Breadcrumbs,
  Tabs,
  Modal,
  Toast,
  Toggle,
  Checkbox,
  InlineMessage,
  Avatar,
  EmptyPlaceholder,
  Tooltip,
  ProgressBar,
  Chip,
  TextInput,
} from '@rdc-npm/rdc-ui-v4'
import {
  IconHome,
  IconUsers,
  IconContact,
  IconListingStatus,
  IconNotifications,
  IconZap,
  IconFilter,
  IconSort,
  IconSparklesSm,
  IconRealAssist,
  IconMagicWand,
  IconUpload,
  IconDelete,
  IconCalendar,
  IconBarChart,
  IconOpen,
  IconArrowLeft,
  IconCamera,
  IconChevronDown,
  IconChevronUp,
  IconClipboard,
  IconLink,
  IconPlay,
  IconOpenHouse,
  IconPhotos,
  IconClose,
  IconInfo,
  IconProfile,
  IconRefreshCw,
  IconLock,
  IconArrowRight,
  IconCircleQuestion,
  IconLightbulb,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconShare,
  IconHomeSlash,
  IconPauseFilled,
  IconSquareFootage,
  IconGarage,
  IconHoa,
  IconHammer,
  IconCar,
  IconEdit,
  IconCheck,
  LogoRealtorProDefault,
  LogoBrandWhite,
  LogoBrand,
} from '@rdc-npm/rdc-ui-v4/illustrations'
import { css } from 'styled-system/css'
import { hstack, vstack } from 'styled-system/patterns'
// Imported as an asset rather than served from public/ so the standalone
// single-file build can inline it as a data URI.
import AUTHORIZATION_RELEASE_PDF_URL from './assets/Authorization-and-Release.pdf?url'
// The generated walkthrough that opens the buyer's hero carousel.
import WALKTHROUGH_VIDEO_URL from './assets/walkthrough.mp4?url'
// The listing's own photo set — same reason these are imported instead of
// served from public/: the standalone build only inlines what the bundler sees.
import PHOTO_EXTERIOR_FRONT from './Images/exterior-front.png'
import PHOTO_FRONT_PORCH from './Images/front-porch.png'
import PHOTO_LIVING_ROOM from './Images/living-room.png'
import PHOTO_KITCHEN from './Images/kitchen.png'
import PHOTO_DINING_ROOM from './Images/dining-room.png'
import PHOTO_PRIMARY_BEDROOM from './Images/primary-bedroom.png'
import PHOTO_PRIMARY_BATHROOM from './Images/primary-bathroom.png'
import PHOTO_OFFICE from './Images/office.png'
import PHOTO_SECONDARY_BATHROOM from './Images/secondary-bathroom.png'
import PHOTO_BACKYARD from './Images/backyard.png'
import PHOTO_AERIAL from './Images/aerial.png'
// AI re-renders of the living room above, one per renovation style.
import RENDER_TRADITIONAL from './Image Renovated/Traditional.png'
import RENDER_CONTEMPORARY from './Image Renovated/Contemporary.png'
import RENDER_MODERN from './Image Renovated/Modern.png'
import RENDER_SCANDI from './Image Renovated/Scandi.png'
import RENDER_INDUSTRIAL from './Image Renovated/Industrial.png'
import RENDER_FARMHOUSE from './Image Renovated/Farmhouse.png'

// ─── Sample data ──────────────────────────────────────────────────────────────

type Performance = 'Above average' | 'Below average' | 'Average'
type CompletenessColor = 'green' | 'yellow' | 'red'

interface Listing {
  id: string
  photo: string
  address1: string
  address2: string
  price: string
  agent: string
  email: string
  phone: string
  listDate: string
  daysAgo: string
  performance: Performance
  completeness: number
  completenessColor: CompletenessColor
  promotionStatus: string
  promoted?: boolean
  mediaEnhanced?: boolean
  /** How many times the agent has regenerated enhanced media for this listing. */
  regenerationsUsed?: number
  uploadedPhotos: string[]
  buyers: string
}

const LISTINGS: Listing[] = [
  {
    id: '1',
    photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=160&h=120&fit=crop',
    address1: '456 Maple Drive',
    address2: 'Dallas, TX 75201',
    price: '$2,450,000',
    agent: 'Bobby Martinez',
    email: 'bmartinez@realtor.com',
    phone: '(214) 555-0142',
    listDate: '02/02/25',
    daysAgo: '3 days ago',
    performance: 'Above average',
    completeness: 90,
    completenessColor: 'green',
    promotionStatus: 'never promoted',
    uploadedPhotos: [],
    buyers: '3 matches',
  },
  {
    id: '2',
    photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=160&h=120&fit=crop',
    address1: '5678 Broadway Ln',
    address2: 'Austin, TX 78730',
    price: '$1,200,000',
    agent: 'Sophia Wang',
    email: 'swang@realtor.com',
    phone: '(512) 555-0187',
    listDate: '01/18/25',
    daysAgo: '17 days ago',
    performance: 'Below average',
    completeness: 30,
    completenessColor: 'red',
    promotionStatus: 'ended 07/25/26',
    uploadedPhotos: [],
    buyers: '11 matches',
  },
  {
    id: '3',
    photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=160&h=120&fit=crop',
    address1: '12345 Sunnyhill Way',
    address2: 'Austin, TX 78730',
    price: '$1,595,000',
    agent: 'William LaClare',
    email: 'wlaclare@realtor.com',
    phone: '(512) 555-0163',
    listDate: '01/18/25',
    daysAgo: '17 days ago',
    performance: 'Average',
    completeness: 50,
    completenessColor: 'yellow',
    promotionStatus: 'ended 07/25/26',
    uploadedPhotos: [],
    buyers: '32 matches',
  },
  {
    id: '4',
    photo: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=160&h=120&fit=crop',
    address1: '456 Oak Avenue',
    address2: 'Austin, TX 78730',
    price: '$1,595,000',
    agent: 'Jose Carlos Zambrano',
    email: 'jzambrano@realtor.com',
    phone: '(512) 555-0119',
    listDate: '01/16/25',
    daysAgo: '19 days ago',
    performance: 'Above average',
    completeness: 92,
    completenessColor: 'green',
    promotionStatus: 'ended 07/25/26',
    uploadedPhotos: [],
    buyers: '3 matches',
  },
  {
    id: '5',
    photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=160&h=120&fit=crop',
    address1: '1001 Northwest Way',
    address2: 'Austin, TX 78730',
    price: '$780,000',
    agent: 'Mary MacGregor',
    email: 'mmacgregor@realtor.com',
    phone: '(512) 555-0104',
    listDate: '01/08/25',
    daysAgo: '27 days ago',
    performance: 'Average',
    completeness: 72,
    completenessColor: 'green',
    promotionStatus: 'ended 07/25/26',
    uploadedPhotos: [],
    buyers: '17 matches',
  },
  {
    id: '6',
    photo: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=160&h=120&fit=crop',
    address1: '98765 Sawtelle Blvd',
    address2: 'Austin, TX 78730',
    price: '$925,000',
    agent: 'Derek Alvarez',
    email: 'dalvarez@realtor.com',
    phone: '(512) 555-0176',
    listDate: '01/08/25',
    daysAgo: '27 days ago',
    performance: 'Above average',
    completeness: 88,
    completenessColor: 'green',
    promotionStatus: 'Promoted',
    promoted: true,
    uploadedPhotos: [],
    buyers: '24 matches',
  },
  {
    id: '7',
    photo: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=160&h=120&fit=crop',
    address1: '210 Cedar Point Rd',
    address2: 'Dallas, TX 75204',
    price: '$640,000',
    agent: 'Priya Nair',
    email: 'pnair@realtor.com',
    phone: '(214) 555-0198',
    listDate: '01/05/25',
    daysAgo: '30 days ago',
    performance: 'Below average',
    completeness: 45,
    completenessColor: 'red',
    promotionStatus: 'never promoted',
    uploadedPhotos: [],
    buyers: '8 matches',
  },
  {
    id: '8',
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=160&h=120&fit=crop',
    address1: '7788 Lakeview Terrace',
    address2: 'Austin, TX 78732',
    price: '$1,150,000',
    agent: 'Kevin Brooks',
    email: 'kbrooks@realtor.com',
    phone: '(512) 555-0155',
    listDate: '12/29/24',
    daysAgo: '37 days ago',
    performance: 'Average',
    completeness: 64,
    completenessColor: 'yellow',
    promotionStatus: 'ended 06/14/26',
    uploadedPhotos: [],
    buyers: '19 matches',
  },
  {
    id: '9',
    photo: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=160&h=120&fit=crop',
    address1: '3402 Elmwood Court',
    address2: 'Dallas, TX 75209',
    price: '$2,100,000',
    agent: 'Angela Foster',
    email: 'afoster@realtor.com',
    phone: '(214) 555-0133',
    listDate: '12/22/24',
    daysAgo: '44 days ago',
    performance: 'Above average',
    completeness: 96,
    completenessColor: 'green',
    promotionStatus: 'Promoted',
    promoted: true,
    uploadedPhotos: [],
    buyers: '41 matches',
  },
  {
    id: '10',
    photo: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=160&h=120&fit=crop',
    address1: '556 Riverbend Dr',
    address2: 'Austin, TX 78746',
    price: '$540,000',
    agent: 'Marcus Lee',
    email: 'mlee@realtor.com',
    phone: '(512) 555-0121',
    listDate: '12/18/24',
    daysAgo: '48 days ago',
    performance: 'Average',
    completeness: 58,
    completenessColor: 'yellow',
    promotionStatus: 'never promoted',
    uploadedPhotos: [],
    buyers: '6 matches',
  },
]

// Performance badge → Tag color
const PERFORMANCE_COLOR: Record<Performance, 'greenSubtle' | 'redSubtle' | 'graySubtle'> = {
  'Above average': 'greenSubtle',
  'Below average': 'redSubtle',
  'Average': 'graySubtle',
}

const SEGMENTS = ['For sale', 'For rent', 'Sold', 'ListHub']

const AVAILABLE_PROMOTIONS = 18

/** Listings below this completeness can't be promoted yet. */
const PROMOTE_MIN_COMPLETENESS = 75

const canPromote = (listing: Listing) => listing.completeness >= PROMOTE_MIN_COMPLETENESS

// ─── Listing completeness breakdown ──────────────────────────────────────────────

interface CompletenessItem {
  title: string
  description: string
}

/**
 * The fixed set of fields the completeness score is made up of. Listings only carry a
 * single completeness percentage (no per-field data), so which of these read as
 * "recommended" vs "completed" for a given listing is derived from that percentage
 * rather than tracked individually — see `getCompletenessBreakdown`.
 */
const COMPLETENESS_ITEMS: CompletenessItem[] = [
  {
    title: 'Add at least 11 photos',
    description:
      'Listings that sell in your area and get more interest from potential buyers have at least 11 photos',
  },
  {
    title: 'Add list price',
    description:
      'Listing prices are required when listing a property, 50% of potential buyers only filter and value price',
  },
  {
    title: 'Add property type',
    description:
      'Property type is a required field, over 85% of daily searches of homes for sale start by filtering for property type',
  },
  {
    title: 'Add number of full bedrooms',
    description:
      'Number of bedrooms is required, potential buyers express interest in it 280% more than other field',
  },
  {
    title: 'Add number of full bathrooms',
    description:
      'Number of bathrooms is required, potential buyers express interest in it 240% more than other fields',
  },
  {
    title: 'Add a description/property bio',
    description: 'Assist in answering potential buyers early questions by providing details in the description',
  },
  {
    title: 'Add square feet of living area',
    description:
      'Potential buyers value living area (sq ft) of the property 152% more than other property features',
  },
  {
    title: 'Add garage type',
    description: 'Does the listing have a garage? 12% of potential buyers value this feature the most',
  },
  {
    title: 'How many garage spots are there?',
    description: 'If the listing has a garage, please document the number of parking spaces',
  },
  {
    title: 'Add number of stories (floors)',
    description:
      'Potential buyers express interest in the # of stories (floors/levels) 145% more than other property features',
  },
  {
    title: 'What year was the property built?',
    description:
      'To ensure potential buyers are accurately filtering for this property, add in the year it was built',
  },
  {
    title: 'Is there an HOA/Association Fee?',
    description:
      'About 16% of potential buyers place value on knowing the homeowner association (HOA) amount/fees',
  },
]

/** Deterministically splits the fixed item list to match a listing's completeness %. */
function getCompletenessBreakdown(completeness: number) {
  const total = COMPLETENESS_ITEMS.length
  const completedCount = Math.round((completeness / 100) * total)
  return {
    recommended: COMPLETENESS_ITEMS.slice(0, total - completedCount),
    completed: COMPLETENESS_ITEMS.slice(total - completedCount),
  }
}

function CompletenessItemRow({ item, complete }: { item: CompletenessItem; complete: boolean }) {
  return (
    <div
      className={css({
        borderWidth: '100',
        borderStyle: 'solid',
        borderColor: 'border.base',
        borderRadius: '200',
        p: '500',
        w: '100%',
      })}
    >
      <div
        className={hstack({
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '400',
          flexWrap: 'wrap',
        })}
      >
        <span className={css({ textStyle: 'bodyMd', fontWeight: 'medium', color: 'text.base' })}>
          {item.title}
        </span>
        {complete && (
          <Tag dataColor="green" startIcon={<IconCheck size={2} />}>
            Completed
          </Tag>
        )}
      </div>
      <p className={css({ textStyle: 'bodySm', color: 'text.alternate', mt: '200' })}>
        {item.description}
      </p>
    </div>
  )
}

function ListingCompletenessCard({ listing }: { listing: Listing }) {
  const { recommended, completed } = getCompletenessBreakdown(listing.completeness)
  const [recommendedOpen, setRecommendedOpen] = useState(true)
  const [completedOpen, setCompletedOpen] = useState(false)

  return (
    <div
      className={css({
        bg: 'bg.base',
        borderWidth: '100',
        borderStyle: 'solid',
        borderColor: 'border.base',
        borderRadius: '300',
        p: { base: '500', md: '800' },
        display: 'flex',
        flexDirection: 'column',
        gap: '700',
      })}
    >
      <div className={vstack({ alignItems: 'flex-start', gap: '600', w: '100%' })}>
        <div
          className={hstack({
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '400',
            w: '100%',
            flexWrap: 'wrap',
          })}
        >
          <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
            Listing completeness
          </h2>
          <Button styleType="Secondary" size="lg" endIcon={<IconOpen size={2} />}>
            Go to MLS
          </Button>
        </div>
        <p className={css({ textStyle: 'bodyLg', color: 'text.alternate' })}>
          Complete the recommended actions to increase the attention your listing gets from
          buyers.{' '}
          <span className={css({ color: 'text.base', textDecoration: 'underline' })}>
            How does this work?
          </span>
        </p>
      </div>

      <div className={vstack({ alignItems: 'flex-end', gap: '300', w: '100%' })}>
        <ProgressBar
          value={listing.completeness}
          barColor={listing.completeness < PROMOTE_MIN_COMPLETENESS ? 'red' : 'green'}
          size="lg"
          aria-label="Listing completeness"
          className={css({ w: '100%' })}
        />
        <div
          className={hstack({
            justifyContent: 'space-between',
            alignItems: 'center',
            w: '100%',
            gap: '300',
          })}
        >
          <span className={css({ textStyle: 'bodyLg', fontWeight: 'medium', color: 'text.base' })}>
            {listing.completeness}% complete
          </span>
          <span className={css({ textStyle: 'caption', color: 'text.alternate', whiteSpace: 'nowrap' })}>
            Changes made in the MLS will take ~15 min to appear
          </span>
        </div>
      </div>

      {recommended.length > 0 && (
        <>
          <div className={css({ h: '1px', bg: 'border.base', w: '100%' })} />
          <div className={vstack({ alignItems: 'flex-start', gap: '500', w: '100%' })}>
            <button
              type="button"
              onClick={() => setRecommendedOpen((open) => !open)}
              aria-expanded={recommendedOpen}
              className={hstack({
                gap: '300',
                alignItems: 'center',
                cursor: 'pointer',
                bg: 'transparent',
                border: 'none',
                p: '0',
              })}
            >
              <span className={css({ textStyle: 'headingSm', fontWeight: 'bold', color: 'text.base' })}>
                Recommended ({recommended.length})
              </span>
              {recommendedOpen ? <IconChevronUp size={2} /> : <IconChevronDown size={2} />}
            </button>
            {recommendedOpen && (
              <div className={vstack({ alignItems: 'stretch', gap: '400', w: '100%' })}>
                {recommended.map((item) => (
                  <CompletenessItemRow key={item.title} item={item} complete={false} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <div className={css({ h: '1px', bg: 'border.base', w: '100%' })} />
          <div className={vstack({ alignItems: 'flex-start', gap: '500', w: '100%' })}>
            <button
              type="button"
              onClick={() => setCompletedOpen((open) => !open)}
              aria-expanded={completedOpen}
              className={hstack({
                gap: '300',
                alignItems: 'center',
                cursor: 'pointer',
                bg: 'transparent',
                border: 'none',
                p: '0',
              })}
            >
              <span className={css({ textStyle: 'headingSm', fontWeight: 'bold', color: 'text.base' })}>
                Completed ({completed.length})
              </span>
              {completedOpen ? <IconChevronUp size={2} /> : <IconChevronDown size={2} />}
            </button>
            {completedOpen && (
              <div className={vstack({ alignItems: 'stretch', gap: '400', w: '100%' })}>
                {completed.map((item) => (
                  <CompletenessItemRow key={item.title} item={item} complete />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/** Agents get a fixed number of enhanced-media regenerations per listing. */
const MAX_REGENERATIONS = 3

const regenerationsLeft = (listing: Listing) =>
  Math.max(0, MAX_REGENERATIONS - (listing.regenerationsUsed ?? 0))

function formatListedDate(mmddyy: string): string {
  const [mm, dd, yy] = mmddyy.split('/').map(Number)
  const date = new Date(2000 + yy, mm - 1, dd)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Chrome dimensions ──────────────────────────────────────────────────────────

const HEADER_HEIGHT = '72px'
const SIDEBAR_WIDTH = '300px'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = () => setMatches(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

// ─── Top bar ────────────────────────────────────────────────────────────────────

function HamburgerIcon() {
  return (
    <span className={vstack({ gap: '4px', w: '20px' })}>
      <span className={css({ w: '100%', h: '2px', bg: 'currentColor', borderRadius: '100' })} />
      <span className={css({ w: '100%', h: '2px', bg: 'currentColor', borderRadius: '100' })} />
      <span className={css({ w: '100%', h: '2px', bg: 'currentColor', borderRadius: '100' })} />
    </span>
  )
}

function TopBar({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  return (
    <header
      className={css({
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        h: HEADER_HEIGHT,
        bg: 'bg.base',
        borderBottomWidth: '100',
        borderBottomStyle: 'solid',
        borderColor: 'border.base',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { base: '400', sm: '600' },
        gap: '400',
        zIndex: 'navbar.fixed',
      })}
    >
      <div className={hstack({ gap: '400', alignItems: 'center', minW: '0' })}>
        {onMenuClick && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuClick}
            className={css({
              display: 'inline-flex',
              md: { display: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              w: '40px',
              h: '40px',
              flexShrink: 0,
              borderRadius: '200',
              cursor: 'pointer',
              color: 'text.base',
              _hoverSupported: { bg: 'bg.alternate' },
            })}
          >
            <HamburgerIcon />
          </button>
        )}
        <LogoRealtorProDefault
          style={{}}
          className={css({
            display: 'block',
            flexShrink: 0,
            h: { base: '18px', sm: '24px' },
            w: { base: '145px', sm: '193px' },
          })}
        />
      </div>

      <div className={hstack({ gap: '400', alignItems: 'center', flexShrink: 0 })}>
        {/* Notification bell with red dot */}
        <button
          aria-label="Notifications"
          className={css({
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            w: '40px',
            h: '40px',
            borderRadius: '200',
            cursor: 'pointer',
            color: 'text.base',
            _hoverSupported: { bg: 'bg.alternate' },
          })}
        >
          <IconNotifications size={3} />
          <span
            className={css({
              position: 'absolute',
              top: '12px',
              right: '12px',
              w: '8px',
              h: '8px',
              borderRadius: '500',
              bg: 'status.error',
              borderWidth: '100',
              borderStyle: 'solid',
              borderColor: 'bg.base',
            })}
          />
        </button>

        {/* Dark rounded-square avatar with initials */}
        <div
          className={css({
            w: '40px',
            h: '40px',
            borderRadius: '200',
            bg: 'bg.inverse',
            color: 'text.inverse',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textStyle: 'bodySm',
            fontWeight: 'bold',
          })}
        >
          JL
        </div>
      </div>
    </header>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────────

type SidebarPage = 'dashboard' | 'all-listings' | 'spotlight-listings'

function SidebarNav({
  activePage,
  onNavigate,
}: {
  activePage: SidebarPage
  onNavigate: (page: SidebarPage) => void
}) {
  const [listingsOpen, setListingsOpen] = useState(true)

  return (
    <SideNavigation className={css({ py: '500' })}>
      <SideNavigationItem
        id="dashboard"
        topLevel
        startIcon={<IconHome size={3} />}
        linkText="Dashboard"
        active={activePage === 'dashboard'}
        onLinkClick={() => onNavigate('dashboard')}
      />

      <SideNavigationGroup
        id="team-group"
        show={false}
        itemProps={{
          id: 'team',
          topLevel: true,
          isParent: true,
          startIcon: <IconUsers size={3} />,
          linkText: 'Team',
          listId: 'team-group',
          show: false,
        }}
      >
        <SideNavigationItem id="team-members" linkText="Members" />
      </SideNavigationGroup>

      <SideNavigationGroup
        id="leads-group"
        show={false}
        itemProps={{
          id: 'leads',
          topLevel: true,
          isParent: true,
          startIcon: <IconContact size={3} />,
          linkText: 'Leads',
          listId: 'leads-group',
          show: false,
        }}
      >
        <SideNavigationItem id="leads-all" linkText="All leads" />
      </SideNavigationGroup>

      <SideNavigationGroup
        id="listings-group"
        show={listingsOpen}
        itemProps={{
          id: 'listings',
          topLevel: true,
          isParent: true,
          startIcon: <IconListingStatus size={3} />,
          linkText: 'Listings',
          listId: 'listings-group',
          show: listingsOpen,
          onArrowClick: () => setListingsOpen((o) => !o),
          onLinkClick: () => setListingsOpen((o) => !o),
        }}
      >
        <SideNavigationItem
          id="all-listings"
          linkText="All listings"
          active={activePage === 'all-listings'}
          onLinkClick={() => onNavigate('all-listings')}
        />
        <SideNavigationItem
          id="spotlight-listings"
          linkText="Spotlight listings"
          active={activePage === 'spotlight-listings'}
          onLinkClick={() => onNavigate('spotlight-listings')}
        />
      </SideNavigationGroup>
    </SideNavigation>
  )
}

function Sidebar({
  activePage,
  onNavigate,
}: {
  activePage: SidebarPage
  onNavigate: (page: SidebarPage) => void
}) {
  return (
    <aside
      className={css({
        display: 'none',
        md: { display: 'block' },
        position: 'fixed',
        top: HEADER_HEIGHT,
        left: '0',
        bottom: '0',
        w: SIDEBAR_WIDTH,
        bg: 'bg.alternate',
        borderRightWidth: '100',
        borderRightStyle: 'solid',
        borderColor: 'border.base',
        overflowY: 'auto',
        zIndex: 'navbar.default',
      })}
    >
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />
    </aside>
  )
}

function MobileSidebarDrawer({
  open,
  onClose,
  activePage,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  activePage: SidebarPage
  onNavigate: (page: SidebarPage) => void
}) {
  return (
    <Modal open={open} onClose={onClose} layout="drawer" drawerPosition="left" size="sm">
      <Modal.Header title="Menu" />
      <Modal.Body noPadding>
        <SidebarNav
          activePage={activePage}
          onNavigate={(page) => {
            onNavigate(page)
            onClose()
          }}
        />
      </Modal.Body>
    </Modal>
  )
}

// ─── Reusable card ──────────────────────────────────────────────────────────────

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={css({
        bg: 'bg.base',
        borderWidth: '100',
        borderStyle: 'solid',
        borderColor: 'border.base',
        borderRadius: '300',
        overflow: 'hidden',
      })}
    >
      <div className={className}>{children}</div>
    </div>
  )
}

// ─── Completeness cell (dot + percent) ──────────────────────────────────────────

const DOT_VAR: Record<CompletenessColor, string> = {
  green: 'var(--colors-status-success)',
  yellow: 'var(--colors-status-warning)',
  red: 'var(--colors-status-error)',
}

function Completeness({ value, color }: { value: number; color: CompletenessColor }) {
  return (
    <span className={hstack({ gap: '200', alignItems: 'center' })}>
      <span
        className={css({ w: '8px', h: '8px', borderRadius: '500', flexShrink: 0 })}
        style={{ backgroundColor: DOT_VAR[color] }}
      />
      <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>{value}%</span>
    </span>
  )
}

// ─── Sortable header cell ───────────────────────────────────────────────────────

function SortableHeader({ label }: { label: string }) {
  return (
    <span className={hstack({ gap: '200', alignItems: 'center', whiteSpace: 'nowrap' })}>
      <span>{label}</span>
      <span className={css({ color: 'text.alternate', display: 'inline-flex', flexShrink: 0 })}>
        <IconSort size={2} />
      </span>
    </span>
  )
}

// ─── All listings screen ────────────────────────────────────────────────────────

function AllListingsScreen({
  listings,
  onSelectListing,
  onPromote,
  onOpenPromoteListings,
  onEnhance,
}: {
  listings: Listing[]
  onSelectListing: (id: string) => void
  onPromote: (listing: Listing) => void
  onOpenPromoteListings: () => void
  onEnhance: (listing: Listing) => void
}) {
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState('For sale')
  const [page, setPage] = useState(1)

  return (
    <div className={vstack({ alignItems: 'stretch', gap: '700' })}>
      {/* Page header */}
      <div
        className={hstack({
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '400',
        })}
      >
        <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
          All listings
        </h1>
        <Button
          styleType="Primary"
          size="lg"
          startIcon={<IconZap size={3} />}
          onClick={onOpenPromoteListings}
        >
          Promote listings
        </Button>
      </div>

      {/* Available promotions banner */}
      <Card className={css({ px: '600', py: '500' })}>
        <span className={css({ textStyle: 'bodyMd', fontWeight: 'bold', color: 'text.base' })}>
          {AVAILABLE_PROMOTIONS} available promotions
        </span>
      </Card>

      {/* Listings table card */}
      <Card>
        {/* Title row */}
        <div className={css({ px: '600', pt: '500', pb: '400' })}>
          <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
            <span className={css({ textStyle: 'bodyMd', fontWeight: 'bold', color: 'text.base' })}>
              311 total listings
            </span>
            <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
              Data provided by MLS
            </span>
          </div>
        </div>

        {/* Filter row */}
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            md: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            gap: '400',
            px: { base: '400', sm: '600' },
            pb: '500',
          })}
        >
          <div className={hstack({ gap: '300', alignItems: 'center', flexWrap: 'wrap' })}>
            <div className={css({ w: { base: '100%', xs: '320px' } })}>
              <Search
                size="inline"
                placeholder="Search for a listing"
                value={search}
                sections={[]}
                onInputChange={(v) => setSearch(v)}
                onSearch={() => {}}
              />
            </div>
            <Button styleType="Tertiary" size="lg" startIcon={<IconFilter size={3} />}>
              Filters
            </Button>
          </div>

          <div className={css({ overflowX: 'auto', maxW: '100%' })}>
            <ContentSwitch size="lg" className={css({ flexShrink: 0 })}>
              {SEGMENTS.map((s) => (
                <ContentSwitch.Item
                  key={s}
                  selected={segment === s}
                  onClick={() => setSegment(s)}
                  className={css({ whiteSpace: 'nowrap', flexShrink: 0 })}
                >
                  {s}
                </ContentSwitch.Item>
              ))}
            </ContentSwitch>
          </div>
        </div>

        {/* Table */}
        <div className={css({ overflowX: 'auto' })}>
        <Table lines>
          <Table.Header>
            <Table.Row>
              <Table.Cell as="th"><SortableHeader label="Property" /></Table.Cell>
              <Table.Cell as="th"><SortableHeader label="Agent" /></Table.Cell>
              <Table.Cell as="th"><SortableHeader label="List date" /></Table.Cell>
              <Table.Cell as="th">Performance</Table.Cell>
              <Table.Cell as="th">Completeness</Table.Cell>
              <Table.Cell as="th">Promotion</Table.Cell>
              <Table.Cell as="th">Buyers</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {listings.map((l) => (
              <Table.Row key={l.id}>
                {/* Property */}
                <Table.Cell>
                  <div className={hstack({ gap: '400', alignItems: 'center' })}>
                    <img
                      src={l.photo}
                      alt=""
                      className={css({
                        w: '56px',
                        h: '48px',
                        borderRadius: '200',
                        objectFit: 'cover',
                        flexShrink: 0,
                        bg: 'bg.alternate',
                      })}
                    />
                    <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                      <Link
                        href="#"
                        underline="default"
                        size="inline"
                        onClick={(e) => {
                          e.preventDefault()
                          onSelectListing(l.id)
                        }}
                      >
                        {l.address1}
                      </Link>
                      <Link
                        href="#"
                        underline="default"
                        size="inline"
                        onClick={(e) => {
                          e.preventDefault()
                          onSelectListing(l.id)
                        }}
                      >
                        {l.address2}
                      </Link>
                      <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
                        {l.price}
                      </span>
                    </div>
                  </div>
                </Table.Cell>

                {/* Agent */}
                <Table.Cell>
                  <span
                    className={css({
                      textStyle: 'bodySm',
                      color: 'text.base',
                      display: 'block',
                      maxW: '140px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    })}
                  >
                    {l.agent}
                  </span>
                </Table.Cell>

                {/* List date */}
                <Table.Cell>
                  <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                    <span className={css({ textStyle: 'bodySm', fontWeight: 'medium', color: 'text.base', whiteSpace: 'nowrap' })}>
                      {l.listDate}
                    </span>
                    <span className={css({ textStyle: 'bodySm', color: 'text.alternate', whiteSpace: 'nowrap' })}>
                      {l.daysAgo}
                    </span>
                  </div>
                </Table.Cell>

                {/* Performance */}
                <Table.Cell>
                  <Tag
                    dataColor={PERFORMANCE_COLOR[l.performance]}
                    className={css({ whiteSpace: 'nowrap' })}
                  >
                    {l.performance}
                  </Tag>
                </Table.Cell>

                {/* Completeness */}
                <Table.Cell>
                  <Completeness value={l.completeness} color={l.completenessColor} />
                </Table.Cell>

                {/* Promotion */}
                <Table.Cell>
                  {l.promoted ? (
                    <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
                      <span className={css({ textStyle: 'bodySm', fontWeight: 'medium', color: 'text.base' })}>
                        Promoted
                      </span>
                      <Button
                        styleType="Tertiary"
                        size="sm"
                        startIcon={<IconSparklesSm size={2} />}
                        onClick={() => onEnhance(l)}
                        className={css({ whiteSpace: 'nowrap' })}
                      >
                        Add media
                      </Button>
                    </div>
                  ) : canPromote(l) ? (
                    <div className={vstack({ alignItems: 'flex-start', gap: '100' })}>
                      <Link
                        href="#"
                        underline="default"
                        size="inline"
                        startIcon={<IconZap size={2} />}
                        onClick={(e) => {
                          e.preventDefault()
                          onPromote(l)
                        }}
                      >
                        Promote
                      </Link>
                      <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                        {l.promotionStatus}
                      </span>
                    </div>
                  ) : (
                    <Tooltip
                      placement="bottom"
                      body={`Reach ${PROMOTE_MIN_COMPLETENESS}% listing completeness to promote this listing.`}
                    >
                      <span
                        className={css({
                          textStyle: 'bodySm',
                          fontWeight: 'medium',
                          color: 'text.disabled',
                        })}
                      >
                        Unavailable
                      </span>
                    </Tooltip>
                  )}
                </Table.Cell>

                {/* Buyers */}
                <Table.Cell>
                  <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>{l.buyers}</span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        </div>

        {/* Pagination */}
        <div className={hstack({ justifyContent: 'center', px: '600', py: '500' })}>
          <Pagination pageCount={13} page={page} asButton onPageClick={setPage} />
        </div>
      </Card>
    </div>
  )
}

// ─── Promote listings screen ─────────────────────────────────────────────────────

function PromoteListingsScreen({
  listings,
  onBack,
  onSelectListing,
  onRequestPromote,
}: {
  listings: Listing[]
  onBack: () => void
  onSelectListing: (id: string) => void
  onRequestPromote: (listings: Listing[]) => void
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const BreadcrumbLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <BackToListingsLink onBack={onBack} {...props} />
  )

  const eligible = listings.filter((l) => !l.promoted)
  const filtered = eligible.filter((l) =>
    `${l.address1} ${l.address2}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handlePromoteSelected = () => {
    const selectedListings = listings.filter((l) => selected.has(l.id))
    onRequestPromote(selectedListings)
    setSelected(new Set())
  }

  return (
    <div className={vstack({ alignItems: 'stretch', gap: '700' })}>
      <div className={vstack({ alignItems: 'flex-start', gap: '400' })}>
        <Breadcrumbs
          items={[{ text: 'Spotlight Listings', href: '#' }, { text: 'Promote listings' }]}
          LinkComponent={BreadcrumbLink}
        />
        <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
          Promote listings
        </h1>
      </div>

      {/* Selected listings card */}
      <Card className={css({ px: '600', py: '600' })}>
        <div className={vstack({ alignItems: 'flex-start', gap: '500' })}>
          <h2 className={css({ textStyle: 'headingSm', color: 'text.base' })}>Selected listings</h2>
          <InlineMessage styleType="info" title={`${AVAILABLE_PROMOTIONS} promotions available`}>
            Apply to a listing below to get premium placement and increased visibility.
          </InlineMessage>
        </div>
      </Card>

      {/* Table card */}
      <Card>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            sm: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            gap: '400',
            px: { base: '400', sm: '600' },
            pt: '600',
            pb: '500',
          })}
        >
          <div className={vstack({ alignItems: 'flex-start', gap: '100' })}>
            <span className={css({ textStyle: 'bodyMd', fontWeight: 'bold', color: 'text.base' })}>
              Select listings for promotion
            </span>
            <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
              {eligible.filter(canPromote).length} promotions available
            </span>
          </div>
          {selected.size > 0 && (
            <div className={hstack({ gap: '400', flexWrap: 'wrap' })}>
              <Button styleType="Tertiary" size="lg" onClick={() => setSelected(new Set())}>
                Clear all
              </Button>
              <Button styleType="Primary" size="lg" onClick={handlePromoteSelected}>
                Promote {selected.size} listing{selected.size === 1 ? '' : 's'}
              </Button>
            </div>
          )}
        </div>

        <div className={css({ px: { base: '400', sm: '600' }, pb: '500' })}>
          <div className={css({ w: { base: '100%', xs: '320px' } })}>
            <Search
              size="inline"
              placeholder="Search for a listing"
              value={search}
              sections={[]}
              onInputChange={(v) => setSearch(v)}
              onSearch={() => {}}
            />
          </div>
        </div>

        <div className={css({ overflowX: 'auto' })}>
        <Table lines>
          <Table.Header>
            <Table.Row>
              <Table.Cell as="th" />
              <Table.Cell as="th"><SortableHeader label="Property" /></Table.Cell>
              <Table.Cell as="th"><SortableHeader label="Agent" /></Table.Cell>
              <Table.Cell as="th"><SortableHeader label="List date" /></Table.Cell>
              <Table.Cell as="th">Completeness</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((l) => (
              <Table.Row key={l.id}>
                <Table.Cell>
                  {canPromote(l) ? (
                    <Checkbox checked={selected.has(l.id)} onChange={() => toggleSelect(l.id)} />
                  ) : (
                    <Tooltip
                      placement="bottom"
                      body={`Reach ${PROMOTE_MIN_COMPLETENESS}% listing completeness to promote this listing.`}
                    >
                      <Checkbox checked={false} disabled onChange={() => {}} />
                    </Tooltip>
                  )}
                </Table.Cell>

                {/* Property */}
                <Table.Cell>
                  <div className={hstack({ gap: '400', alignItems: 'center' })}>
                    <img
                      src={l.photo}
                      alt=""
                      className={css({
                        w: '56px',
                        h: '48px',
                        borderRadius: '200',
                        objectFit: 'cover',
                        flexShrink: 0,
                        bg: 'bg.alternate',
                      })}
                    />
                    <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                      <Link
                        href="#"
                        underline="default"
                        size="inline"
                        onClick={(e) => {
                          e.preventDefault()
                          onSelectListing(l.id)
                        }}
                      >
                        {l.address1}
                      </Link>
                      <Link
                        href="#"
                        underline="default"
                        size="inline"
                        onClick={(e) => {
                          e.preventDefault()
                          onSelectListing(l.id)
                        }}
                      >
                        {l.address2}
                      </Link>
                      <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
                        {l.price}
                      </span>
                    </div>
                  </div>
                </Table.Cell>

                {/* Agent */}
                <Table.Cell>
                  <span
                    className={css({
                      textStyle: 'bodySm',
                      color: 'text.base',
                      display: 'block',
                      maxW: '140px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    })}
                  >
                    {l.agent}
                  </span>
                </Table.Cell>

                {/* List date */}
                <Table.Cell>
                  <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                    <span className={css({ textStyle: 'bodySm', fontWeight: 'medium', color: 'text.base', whiteSpace: 'nowrap' })}>
                      {l.listDate}
                    </span>
                    <span className={css({ textStyle: 'bodySm', color: 'text.alternate', whiteSpace: 'nowrap' })}>
                      {l.daysAgo}
                    </span>
                  </div>
                </Table.Cell>

                {/* Completeness */}
                <Table.Cell>
                  <Completeness value={l.completeness} color={l.completenessColor} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        </div>

        {/* Pagination */}
        <div className={hstack({ justifyContent: 'center', px: '600', py: '500' })}>
          <Pagination pageCount={5} page={page} asButton onPageClick={setPage} />
        </div>
      </Card>
    </div>
  )
}

// ─── Listing detail screen ───────────────────────────────────────────────────────

function BackToListingsLink({
  onBack,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { onBack: () => void }) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        e.preventDefault()
        onBack()
      }}
    />
  )
}

function ListingDetailScreen({
  listing,
  onBack,
  onPromote,
  onEnhance,
  viewOnRealtorHref,
  onViewOnRealtor,
}: {
  listing: Listing
  onBack: () => void
  onPromote: (listing: Listing) => void
  onEnhance: (listing: Listing) => void
  /** Deep link the buyer's view opens at, in its own tab. */
  viewOnRealtorHref: string
  /** Fires just before that tab opens, to hand it the current listing data. */
  onViewOnRealtor: (listing: Listing) => void
}) {
  const BreadcrumbLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <BackToListingsLink onBack={onBack} {...props} />
  )
  const [walkthroughAdded, setWalkthroughAdded] = useState(true)
  const [pendingToggle, setPendingToggle] = useState<'add' | 'remove' | null>(null)

  const contentRef = useRef<HTMLDivElement>(null)
  const [photoHeight, setPhotoHeight] = useState<number | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useLayoutEffect(() => {
    if (contentRef.current) {
      setPhotoHeight(contentRef.current.getBoundingClientRect().height)
    }
  }, [listing.id, isDesktop])

  const initials = listing.agent.split(' ')

  return (
    <div className={vstack({ alignItems: 'stretch', gap: '700' })}>
      {/* Header */}
      <div className={vstack({ alignItems: 'flex-start', gap: '600' })}>
        <Breadcrumbs
          items={[
            { text: 'All listings', href: '#' },
            { text: `${listing.address1}, ${listing.address2}` },
          ]}
          LinkComponent={BreadcrumbLink}
        />

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            md: { flexDirection: 'row' },
            gap: '500',
            alignItems: 'flex-start',
            w: '100%',
          })}
        >
          <div
            className={css({
              borderRadius: '300',
              overflow: 'hidden',
              flexShrink: 0,
              bg: 'bg.alternate',
              w: { base: '100%', md: 'auto' },
              aspectRatio: { base: '4 / 3', md: 'auto' },
            })}
            style={
              isDesktop
                ? {
                    height: photoHeight ?? undefined,
                    width: photoHeight ? (photoHeight * 4) / 3 : undefined,
                  }
                : undefined
            }
          >
            <img
              src={listing.photo}
              alt=""
              className={css({ w: '100%', h: '100%', objectFit: 'cover', display: 'block' })}
            />
          </div>
          <div
            ref={contentRef}
            className={vstack({ alignItems: 'flex-start', gap: '300', w: '100%' })}
          >
            <div className={hstack({ gap: '200', alignItems: 'center', flexWrap: 'wrap' })}>
              {listing.promoted && (
                <Tag dataColor="blue" startIcon={<IconZap size={2} />}>
                  Spotlight Listing
                </Tag>
              )}
              <Tag dataColor="green">For Sale</Tag>
              <Tag dataColor="graySubtle" startIcon={<IconCalendar size={2} />}>
                {listing.daysAgo.replace(' ago', ' on market')}
              </Tag>
            </div>
            <div
              className={hstack({
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '400',
                w: '100%',
                flexWrap: 'wrap',
              })}
            >
              <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
                {listing.address1}, {listing.address2}
              </h1>
              {!listing.promoted &&
                (canPromote(listing) ? (
                  <Button
                    styleType="Primary"
                    size="lg"
                    startIcon={<IconZap size={3} />}
                    onClick={() => onPromote(listing)}
                  >
                    Promote Listing
                  </Button>
                ) : (
                  <Tooltip
                    placement="bottom"
                    body={`Reach ${PROMOTE_MIN_COMPLETENESS}% listing completeness to promote this listing.`}
                  >
                    {/* Haven marks disabled buttons with aria-disabled rather than the
                        native attribute, so hover and focus still reach the trigger. */}
                    <Button styleType="Primary" size="lg" disabled>
                      Unavailable
                    </Button>
                  </Tooltip>
                ))}
            </div>
            <div className={hstack({ gap: '300', alignItems: 'center' })}>
              <span className={css({ textStyle: 'bodyMd', color: 'text.alternate' })}>
                {listing.price}
              </span>
              <span className={css({ textStyle: 'bodyMd', color: 'text.alternate' })}>•</span>
              <span className={css({ textStyle: 'bodyMd', color: 'text.alternate' })}>
                Listed: {formatListedDate(listing.listDate)}
              </span>
            </div>
            <div className={hstack({ gap: '400', alignItems: 'center' })}>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <Avatar size="xs" initials={initials} />
                <Link href="#" underline="default" size="inline">
                  {listing.agent}
                </Link>
              </div>
              <Link
                href={viewOnRealtorHref}
                target="_blank"
                rel="noopener noreferrer"
                underline="default"
                size="lg"
                endIcon={<IconOpen size={2} />}
                // Runs before the browser follows the link, so the new tab finds
                // the up-to-date listing data waiting for it.
                onClick={() => onViewOnRealtor(listing)}
              >
                View on Realtor.com
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <Tabs.List>
          <Tabs.Trigger value="insights">Insights</Tabs.Trigger>
          <Tabs.Trigger value="details">Listing details</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="insights">
          <div className={vstack({ alignItems: 'center', justifyContent: 'center', minH: '400px' })}>
            <EmptyPlaceholder
              media={<IconBarChart size={5} />}
              title="Insights coming soon"
              description="Performance and buyer engagement insights for this listing will appear here."
            />
          </div>
        </Tabs.Content>
        <Tabs.Content value="details">
          <div className={vstack({ alignItems: 'stretch', gap: '600', mt: '400', w: '100%' })}>
          {listing.promoted && (
            <div
              className={css({
                bg: 'bg.base',
                borderWidth: '100',
                borderStyle: 'solid',
                borderColor: 'border.base',
                borderRadius: '300',
                p: { base: '500', md: '800' },
                display: 'flex',
                flexDirection: 'column',
                gap: '400',
              })}
            >
            {listing.mediaEnhanced ? (
              <div className={vstack({ alignItems: 'flex-start', gap: '600', w: '100%' })}>
                <div className={vstack({ alignItems: 'flex-start', gap: '200', w: '100%' })}>
                  <div
                    className={hstack({
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '400',
                      w: '100%',
                    })}
                  >
                    <div className={hstack({ gap: '400', alignItems: 'center' })}>
                      <IconRealAssist size={3} />
                      <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
                        Enhanced media
                      </h2>
                    </div>
                    <Toggle
                      checked={walkthroughAdded}
                      onChange={(_, checked) => setPendingToggle(checked ? 'add' : 'remove')}
                    >
                      {walkthroughAdded ? 'On' : 'Off'}
                    </Toggle>
                  </div>
                  <p className={css({ textStyle: 'bodyMd', color: 'text.alternate', w: '100%' })}>
                    Your uploaded photos are enhanced with AI to make your Spotlight Listing stand
                    out. Turn it off at anytime.
                  </p>
                </div>

                {walkthroughAdded && (
                  <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
                    <div className={hstack({ gap: '500', alignItems: 'center', flexWrap: 'wrap' })}>
                      <div className={hstack({ gap: '200', alignItems: 'center', flexWrap: 'wrap' })}>
                        {listing.uploadedPhotos.slice(0, 4).map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt=""
                            className={css({
                              w: '95px',
                              h: '63px',
                              borderRadius: '200',
                              objectFit: 'cover',
                              flexShrink: 0,
                              bg: 'bg.alternate',
                            })}
                          />
                        ))}
                      </div>
                      {regenerationsLeft(listing) === 0 ? (
                        <Tooltip
                          placement="bottom"
                          body="You have reached the max amount of regenerations."
                        >
                          {/* Haven marks disabled buttons with aria-disabled rather than the
                              native attribute, so hover and focus still reach the trigger. */}
                          <Button styleType="Tertiary" size="sm" disabled>
                            Edit photos
                          </Button>
                        </Tooltip>
                      ) : (
                        <Button styleType="Tertiary" size="sm" onClick={() => onEnhance(listing)}>
                          Edit photos
                        </Button>
                      )}
                    </div>
                    <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                      Showing {Math.min(4, listing.uploadedPhotos.length)} of{' '}
                      {listing.uploadedPhotos.length} photos
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  sm: { flexDirection: 'row', alignItems: 'center' },
                  alignItems: 'stretch',
                  gap: '500',
                  w: '100%',
                })}
              >
                <div className={vstack({ alignItems: 'flex-start', gap: '300', flex: '1' })}>
                  <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
                    Enhance your Spotlight Listing
                  </h2>
                  <p className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
                    Your Spotlight Listing is live. Add images and we'll transform your photos into
                    immersive video and AI-enhanced media, giving buyers a fuller picture of the
                    home and helping your listing stand out.
                  </p>
                </div>
                <Button
                  styleType="Primary"
                  size="lg"
                  startIcon={<IconSparklesSm size={3} />}
                  onClick={() => onEnhance(listing)}
                >
                  Enhance promotion
                </Button>
              </div>
            )}
            </div>
          )}

          <ListingCompletenessCard listing={listing} />
          </div>
        </Tabs.Content>
      </Tabs>

      <Modal
        open={pendingToggle !== null}
        onClose={() => setPendingToggle(null)}
        mobileLayout="fullScreen"
      >
        <Modal.Header
          title={
            pendingToggle === 'remove'
              ? 'Remove enhanced media from your listing?'
              : 'Add enhanced media to your listing?'
          }
        />
        <Modal.Body>
          <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
            {pendingToggle === 'remove'
              ? 'Your AI enhanced media is live on your listing. Removing it will change how your listing appears to buyers.'
              : "We'll reuse the enhanced media already generated for this listing. No new media will be created."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className={hstack({ gap: '400', justifyContent: 'flex-end', w: '100%' })}>
            <Button styleType="Tertiary" size="lg" onClick={() => setPendingToggle(null)}>
              Cancel
            </Button>
            <Button
              styleType="Primary"
              size="lg"
              onClick={() => {
                setWalkthroughAdded(pendingToggle === 'add')
                setPendingToggle(null)
              }}
            >
              {pendingToggle === 'remove' ? 'Remove from listing' : 'Add to listing'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

// ─── Photo thumbnail ────────────────────────────────────────────────────────────

function PhotoThumbnail({
  src,
  onDelete,
  index,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  src: string
  onDelete: () => void
  index: number
  isDragging: boolean
  isDropTarget: boolean
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDrop: (index: number) => void
  onDragEnd: () => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(index)
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(index)
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(index)
      }}
      className={css({
        position: 'relative',
        w: { base: '140px', xs: '160px', md: '190px' },
        aspectRatio: '3 / 2',
        borderRadius: '200',
        overflow: 'hidden',
        bg: 'bg.alternate',
        flexShrink: 0,
        cursor: 'grab',
        opacity: isDragging ? '0.4' : '1',
        outlineWidth: isDropTarget ? '3px' : '0px',
        outlineStyle: 'solid',
        outlineColor: 'border.focus',
        outlineOffset: '2px',
        transition: 'opacity 0.15s ease',
      })}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className={css({ w: '100%', h: '100%', objectFit: 'cover', display: 'block' })}
      />
      <div
        draggable={false}
        className={css({ position: 'absolute', bottom: '200', right: '200' })}
      >
        <button
          type="button"
          aria-label="Delete photo"
          onClick={onDelete}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            w: '32px',
            h: '32px',
            borderRadius: 'circle',
            bg: 'bg.inverse',
            color: 'text.inverse',
            cursor: 'pointer',
            _hoverSupported: { bg: 'bg.inverse.alternate' },
          })}
        >
          <IconDelete size={2} />
        </button>
      </div>
    </div>
  )
}

// ─── Photo upload screen ─────────────────────────────────────────────────────────

/** Ordered the way an agent would actually upload a shoot: outside in. */
const SAMPLE_HOUSE_PHOTOS = [
  PHOTO_EXTERIOR_FRONT,
  PHOTO_FRONT_PORCH,
  PHOTO_LIVING_ROOM,
  PHOTO_KITCHEN,
  PHOTO_DINING_ROOM,
  PHOTO_PRIMARY_BEDROOM,
  PHOTO_PRIMARY_BATHROOM,
  PHOTO_OFFICE,
  PHOTO_SECONDARY_BATHROOM,
  PHOTO_BACKYARD,
  PHOTO_AERIAL,
]

function PhotoUploadScreen({
  listing,
  onBack,
  onSave,
}: {
  listing: Listing
  onBack: () => void
  onSave: (photos: string[]) => void
}) {
  const [photos, setPhotos] = useState<string[]>(listing.uploadedPhotos)
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; src: string } | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handlePhotoDragStart = (index: number) => setDragIndex(index)

  const handlePhotoDragOver = (index: number) => {
    if (dragIndex === null || dragIndex === index) return
    setDragOverIndex(index)
  }

  const handlePhotoDrop = (index: number) => {
    setDragOverIndex(null)
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      return
    }
    setPhotos((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      return next
    })
    setDragIndex(null)
  }

  const handlePhotoDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDropzoneClick = () => {
    // Everything is derived from `prev` rather than the `photos` closure, so two
    // clicks in the same render can't both pick the same batch and duplicate it.
    setPhotos((prev) => {
      // Exclude anything already in this session's photos AND anything already
      // authorized for this listing, so a deleted-then-re-added photo is never
      // silently treated as "already covered" by the prior consent.
      const excluded = new Set([...prev, ...listing.uploadedPhotos])
      let remaining = SAMPLE_HOUSE_PHOTOS.filter((url) => !excluded.has(url))
      if (remaining.length === 0) {
        // Sample pool exhausted for this listing — recycle it with a distinguishing
        // suffix so the dropzone still simulates a fresh upload. A fragment (not a
        // query string) keeps bundled asset URLs resolvable.
        remaining = SAMPLE_HOUSE_PHOTOS.map((url) => `${url}#v=${Date.now()}`)
      }
      // One click stands in for selecting the whole shoot, so take everything.
      return [...prev, ...remaining]
    })
  }

  // Re-entering the upload screen on a listing that already has enhanced media
  // means the next save regenerates that media rather than creating it.
  const isRegeneration = listing.mediaEnhanced === true
  const regenerationsRemaining = regenerationsLeft(listing)

  // Nothing is published yet on the first pass, so removing a photo is harmless —
  // only warn once a delete would force the live enhanced media to be regenerated.
  const handleDeletePhoto = (index: number) => {
    if (isRegeneration) {
      setDeleteTarget({ index, src: photos[index] })
    } else {
      setPhotos((prev) => prev.filter((_, i) => i !== index))
    }
  }

  return (
    <div className={css({ minH: '100dvh', bg: 'bg.base' })}>
      <div
        className={vstack({
          alignItems: 'stretch',
          gap: '600',
          px: { base: '400', sm: '800', md: '1600' },
          py: { base: '500', md: '800' },
          pb: { base: '1200', md: '1600' },
        })}
      >
        <div className={vstack({ alignItems: 'flex-start', gap: '300' })}>
          <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
            Enhanced media photo upload
          </h1>
          <p className={css({ textStyle: 'bodyMd', color: 'text.base', maxW: '900px' })}>
            Upload every photo you have the rights to use. More photos means a richer, more immersive
            experience for buyers, from wide exterior shots to close-up details that tell the full
            story of the property.
          </p>
        </div>

        {isRegeneration && (
          <InlineMessage
            styleType="info"
            title={`${regenerationsRemaining} regenerations remaining`}
          >
            Adding or removing photos will regenerate your enhanced video and room renovations from your new photo set. This will replace what's currently on your listing and can't be undone.
          </InlineMessage>
        )}

        <div
          className={css({
            bg: 'bg.base',
            borderWidth: '100',
            borderStyle: 'solid',
            borderColor: 'border.base',
            borderRadius: '300',
            p: { base: '400', md: '800' },
            display: 'flex',
            flexDirection: 'column',
            gap: '600',
          })}
        >
          <div className={vstack({ alignItems: 'flex-start', gap: '100' })}>
            <span className={css({ textStyle: 'bodyMd', fontWeight: 'bold', color: 'text.base' })}>
              Photos ({photos.length})
            </span>
            <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
              Minimum 5 photos required for custom photos
            </span>
          </div>

          {/* Dropzone */}
          <button
            type="button"
            onClick={handleDropzoneClick}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '300',
              w: '100%',
              px: '600',
              py: '700',
              bg: 'bg.base',
              borderWidth: '200',
              borderStyle: 'dashed',
              borderColor: 'border.base',
              borderRadius: '200',
              cursor: 'pointer',
              _hoverSupported: { bg: 'bg.alternate' },
            })}
          >
            <IconUpload size={3} />
            <div className={vstack({ alignItems: 'center', gap: '200' })}>
              <span className={css({ textStyle: 'bodyMd', color: 'text.base' })}>
                Drag and drop your file(s) here or{' '}
                <span className={css({ textDecoration: 'underline', fontWeight: 'medium' })}>
                  browse files
                </span>
              </span>
              <span className={css({ textStyle: 'bodyMd', color: 'text.alternate' })}>
                JPG, PNG, HEIC | Max 20MB | Min 1,000px
              </span>
            </div>
          </button>

          {/* Thumbnails */}
          {photos.length > 0 && (
            <div className={hstack({ gap: '300', alignItems: 'center', flexWrap: 'wrap' })}>
              {photos.map((src, i) => (
                <PhotoThumbnail
                  key={src}
                  src={src}
                  index={i}
                  onDelete={() => handleDeletePhoto(i)}
                  isDragging={dragIndex === i}
                  isDropTarget={dragOverIndex === i && dragIndex !== i}
                  onDragStart={handlePhotoDragStart}
                  onDragOver={handlePhotoDragOver}
                  onDrop={handlePhotoDrop}
                  onDragEnd={handlePhotoDragEnd}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div
        className={css({
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          bg: 'bg.base',
          borderTopWidth: '100',
          borderTopStyle: 'solid',
          borderColor: 'border.base',
          boxShadow: 'dialog',
          p: '500',
        })}
      >
        <div className={hstack({ justifyContent: 'flex-end', gap: '400' })}>
          <Button styleType="Tertiary" size="lg" onClick={onBack}>
            Go back
          </Button>
          <Button
            styleType="Primary"
            size="lg"
            disabled={photos.length === 0}
            onClick={() => onSave(photos)}
          >
            {isRegeneration ? 'Regenerate media' : 'Save images'}
          </Button>
        </div>
      </div>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} mobileLayout="fullScreen">
        <Modal.Header title="Delete this photo?" />
        <Modal.Body>
          <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
            By deleting this photo, your enhanced media will need to be regenerated.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className={hstack({ gap: '400', justifyContent: 'flex-end', w: '100%' })}>
            <Button styleType="Tertiary" size="lg" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              styleType="Primary"
              size="lg"
              onClick={() => {
                if (deleteTarget) {
                  setPhotos((prev) => prev.filter((_, i) => i !== deleteTarget.index))
                }
                setDeleteTarget(null)
              }}
            >
              Delete photo
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

// ─── Promote modal ──────────────────────────────────────────────────────────────

function PromoteModal({
  listings,
  onClose,
  onConfirm,
}: {
  listings: Listing[] | null
  onClose: () => void
  onConfirm: () => void
}) {
  const count = listings?.length ?? 0
  return (
    <Modal open={!!listings} onClose={onClose} mobileLayout="fullScreen">
      <Modal.Header
        title={`Apply ${count} of your ${AVAILABLE_PROMOTIONS} available promotions?`}
      />
      <Modal.Body>
        <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
          {count === 1
            ? 'Your promotion will start shortly and run until the listing is sold or off market.'
            : 'Your promotions will start shortly and run until each listing is sold or off market.'}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className={hstack({ gap: '400', justifyContent: 'flex-end', w: '100%' })}>
          <Button styleType="Tertiary" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button styleType="Primary" size="lg" onClick={onConfirm}>
            Promote listing{count === 1 ? '' : 's'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

// ─── Save images consent modal ───────────────────────────────────────────────────

function SaveImagesModal({
  open,
  onClose,
  onDeny,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onDeny: () => void
  onConfirm: () => void
}) {
  const [agreed, setAgreed] = useState(false)

  const handleClose = () => {
    setAgreed(false)
    onClose()
  }

  const handleDeny = () => {
    setAgreed(false)
    onDeny()
  }

  return (
    <Modal open={open} onClose={handleClose} mobileLayout="fullScreen">
      <Modal.Header title="Confirm Authorization and Release" />
      <Modal.Body>
        <div className={vstack({ alignItems: 'stretch', gap: '600' })}>
          <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
            Before you upload photos, please read this{' '}
            <Link
              href={AUTHORIZATION_RELEASE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline="default"
              size="inline"
            >
              Authorization and Release
            </Link>
            . By checking the below box, you agree to the Authorization and Release. Further, by
            checking the below box, you confirm that you are the owner or licensee of all photos
            that you upload and that you have the rights to upload all such photos and to grant
            all of the rights and permissions granted in the Authorization and Release. You also
            authorize Realtor.com to display any video walk-through or other enhanced media
            created using the uploaded photos as the first photo(s) (i.e., ahead of MLS-provided
            photos) in the photo carousel for the applicable property on Realtor.com.
          </p>

          <div
            className={css({
              borderWidth: '100',
              borderStyle: 'solid',
              borderColor: 'border.base',
              borderRadius: '300',
              p: '500',
            })}
          >
            <Checkbox checked={agreed} onChange={(_, checked) => setAgreed(checked)}>
              I have read and agree to the Authorization and Release
            </Checkbox>
          </div>

          <InlineMessage styleType="warning">
            If you deny permission, your photos will not be uploaded.
          </InlineMessage>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={hstack({ gap: '400', justifyContent: 'flex-end', w: '100%' })}>
          <Button styleType="Ghost" onClick={handleDeny}>
            Deny permission
          </Button>
          <Button
            styleType="Primary"
            size="lg"
            disabled={!agreed}
            onClick={() => {
              setAgreed(false)
              onConfirm()
            }}
          >
            Save photos
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

// ─── Publishing photos progress modal ────────────────────────────────────────────

const PUBLISH_STEP_MS = 700

function PublishingPhotosModal({
  photos,
  onCancel,
  onComplete,
}: {
  /** Non-null while publishing; the photos being uploaded, in order. */
  photos: string[] | null
  onCancel: () => void
  onComplete: () => void
}) {
  const [uploaded, setUploaded] = useState(0)
  const total = photos?.length ?? 0

  // Keeps the advance effect from re-running just because the parent re-rendered
  // with a fresh onComplete closure.
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Reset the counter every time a new publish run starts.
  useEffect(() => {
    if (photos) setUploaded(0)
  }, [photos])

  // Advance one photo per tick, then hand off to onComplete.
  useEffect(() => {
    if (!photos || total === 0) return
    if (uploaded >= total) {
      const done = setTimeout(onCompleteRef.current, PUBLISH_STEP_MS / 2)
      return () => clearTimeout(done)
    }
    const next = setTimeout(() => setUploaded((n) => n + 1), PUBLISH_STEP_MS)
    return () => clearTimeout(next)
  }, [photos, total, uploaded])

  const current = Math.min(uploaded + 1, Math.max(total, 1))

  return (
    <Modal open={!!photos} onClose={onCancel} mobileLayout="fullScreen">
      <Modal.Header title="Publishing photos" />
      <Modal.Body>
        <div className={vstack({ alignItems: 'stretch', gap: '600' })}>
          <div
            className={css({
              w: '100%',
              maxW: '360px',
              mx: 'auto',
              aspectRatio: '3 / 2',
              borderRadius: '200',
              overflow: 'hidden',
              bg: 'bg.alternate',
            })}
          >
            {photos && photos[Math.min(uploaded, total - 1)] && (
              <img
                src={photos[Math.min(uploaded, total - 1)]}
                alt=""
                className={css({ w: '100%', h: '100%', objectFit: 'cover', display: 'block' })}
              />
            )}
          </div>

          <div className={vstack({ alignItems: 'stretch', gap: '200' })}>
            <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>
              Photo {current} of {total}
            </span>
            <ProgressBar
              value={total === 0 ? 0 : Math.round((Math.min(uploaded + 1, total) / total) * 100)}
              aria-label="Publishing photos progress"
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

// ─── Experiences ────────────────────────────────────────────────────────────────

type Experience = 'overview' | 'team' | 'agent'

const EXPERIENCES: { id: Experience; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'team', label: 'Team experience' },
  { id: 'agent', label: 'Agent experience' },
]

function PlaceholderExperience({ label }: { label: string }) {
  return (
    <div
      className={css({
        minH: '100dvh',
        pt: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <EmptyPlaceholder
        title={label}
        description="This experience hasn't been brought into the prototype yet."
      />
    </div>
  )
}

// ─── Overview screen ────────────────────────────────────────────────────────────

const OVERVIEW_DETAILS = [
  {
    icon: <IconMagicWand size={3} />,
    title: 'A more premium consumer experience',
    description:
      'Automatic conservative optimization (lighting, color, geometry) is on by default, so every promoted listing looks its best without any extra work from the agent.',
  },
  {
    icon: <IconUsers size={3} />,
    title: 'Team-managed uploads',
    description:
      "Team admins can add photos on behalf of their agents right from the All Listings table in RPD, right after promoting a listing—and then choose to enhance that media so quality photos ship without waiting on each individual agent.",
  },
  {
    icon: <IconLock size={3} />,
    title: 'Rights handled up front',
    description:
      "A simple consent step confirms the uploader is the copyright owner or authorized licensee of every photo before it's optimized or published, giving Legal a defensible, auditable record.",
  },
  {
    icon: <IconRefreshCw size={3} />,
    title: 'Control over enhancement display',
    description:
      "Enhanced media can be turned off—or back on—in one simple step, so team admins can adjust how a listing looks at any time.",
    note:
      "Note for this MVP: toggling off does not delete or regenerate the underlying enhanced media—RDC retains the legal rights to all photos uploaded, even once deleted, so this control only affects whether the enhanced version displays in the consumer experience, not whether it's recreated.",
  },
  {
    icon: <IconNotifications size={3} />,
    title: 'Transparent to agents',
    description:
      'Agents are notified by email whenever their team adds enhanced media, and can see photo source ("Current photo source: Team upload") on their Listing Details page.',
  },
]

function OverviewScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className={vstack({ alignItems: 'stretch', gap: '700' })}>
      <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
        Overview
      </h1>

      <Card className={css({ px: { base: '400', lg: '800' }, py: { base: '500', lg: '700' } })}>
        <div className={vstack({ alignItems: 'flex-start', gap: '400' })}>
          <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
            Spotlight Listings — Photo Upload &amp; Image Rights MVP
          </h2>
          <p className={css({ textStyle: 'bodyLg', color: 'text.alternate' })}>
            Our goal is to make every promoted listing stand out with a richer, more immersive
            consumer experience. By giving team admins an easy way to upload listing photos on
            behalf of their agents from RPD (RealPro Dashboard), and automatically optimizing them
            into premium enhanced media, we close the visual gap with top competitor listings and
            give buyers a reason to stop scrolling.
          </p>
          <p className={css({ textStyle: 'bodyLg', fontWeight: 'bold', color: 'text.base' })}>
            In this first iteration, uploading is a team admin capability; agents view the results
            from their Pro Dashboard, with self-serve agent upload planned as a later phase.
          </p>
        </div>
      </Card>

      <Card className={css({ px: { base: '400', lg: '800' }, py: { base: '500', lg: '700' } })}>
        <div className={vstack({ alignItems: 'flex-start', gap: '600' })}>
          <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
            Important details
          </h2>
          <div className={vstack({ alignItems: 'stretch', gap: '600', w: '100%' })}>
            {OVERVIEW_DETAILS.map((detail) => (
              <div
                key={detail.title}
                className={hstack({ gap: '400', alignItems: 'flex-start' })}
              >
                <div
                  className={css({
                    flexShrink: 0,
                    color: 'text.base',
                    display: 'inline-flex',
                    mt: '100',
                  })}
                >
                  {detail.icon}
                </div>
                <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
                  <p className={css({ textStyle: 'bodyMd', color: 'text.base' })}>
                    <strong>{detail.title}:</strong> {detail.description}
                  </p>
                  {detail.note && (
                    <p className={css({ textStyle: 'bodyMd', color: 'text.alternate' })}>
                      {detail.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className={hstack({ justifyContent: 'flex-end' })}>
        <Button styleType="Primary" size="lg" endIcon={<IconArrowRight size={3} />} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}

const EXPECTATIONS_DETAILS = [
  {
    icon: <IconCircleQuestion size={3} />,
    title: 'Questions on Photo Upload & Image Rights',
    description:
      'We will recap feedback given at the end of this session and flag anything we need to further discuss as a team.',
  },
  {
    icon: <IconLightbulb size={3} />,
    title: 'Considerations for continued optimization after this first iteration',
    description:
      'All feedback is welcome and will be noted for consideration as part of continued optimizations (e.g., self-serve agent upload, video/panning enhancements, e-signature-grade consent, AI-generated media).',
  },
]

function ExpectationsScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className={vstack({ alignItems: 'stretch', gap: '700' })}>
      <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
        Expectations
      </h1>

      <Card className={css({ px: { base: '400', lg: '800' }, py: { base: '500', lg: '700' } })}>
        <div className={vstack({ alignItems: 'flex-start', gap: '400' })}>
          <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
            Spotlight Listings — Photo Upload &amp; Image Rights
          </h2>
          <h3 className={css({ textStyle: 'headingSm', fontWeight: 'bold', color: 'text.base' })}>
            Walkthrough expectations
          </h3>
          <p className={css({ textStyle: 'bodyLg', color: 'text.alternate' })}>
            Designs shown today are what we plan on delivering to meet our first iteration of
            team-managed photo upload and image rights consent. Any adjustments to the core
            requirements will need to go through our Change Request log to preserve the integrity
            of the plan that's in place and being worked on by engineering. Today, we'll be
            looking for your thoughts on:
          </p>
        </div>
      </Card>

      <Card className={css({ px: { base: '400', lg: '800' }, py: { base: '500', lg: '700' } })}>
        <div className={vstack({ alignItems: 'stretch', gap: '600', w: '100%' })}>
          {EXPECTATIONS_DETAILS.map((detail) => (
            <div key={detail.title} className={hstack({ gap: '400', alignItems: 'flex-start' })}>
              <div
                className={css({
                  flexShrink: 0,
                  color: 'text.base',
                  display: 'inline-flex',
                  mt: '100',
                })}
              >
                {detail.icon}
              </div>
              <p className={css({ textStyle: 'bodyMd', color: 'text.base' })}>
                <strong>{detail.title}:</strong> {detail.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className={hstack({ justifyContent: 'space-between' })}>
        <Button styleType="Tertiary" size="lg" startIcon={<IconArrowLeft size={3} />} onClick={onBack}>
          Back
        </Button>
        <Button styleType="Primary" size="lg" endIcon={<IconArrowRight size={3} />} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}

const TOC_FEATURE_WALKTHROUGHS = [
  'Team admin (RPD) — promote listing → add enhanced media → photo upload & image rights consent',
  'Team admin (RPD) — listing details (photo source, "Enhanced" badge, manage media)',
  'Participating agent (Pro Dashboard) — enhanced media notification & listing details view',
]

function TocScreen({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <div className={vstack({ alignItems: 'stretch', gap: '700' })}>
      <h1 className={css({ textStyle: 'headingLg', fontWeight: 'bold', color: 'text.base' })}>
        Table of Contents
      </h1>

      <Card className={css({ px: { base: '400', lg: '800' }, py: { base: '500', lg: '700' } })}>
        <div className={vstack({ alignItems: 'flex-start', gap: '400' })}>
          <h2 className={css({ textStyle: 'headingMd', fontWeight: 'bold', color: 'text.base' })}>
            Spotlight Listings — Photo Upload &amp; Image Rights
          </h2>

          <div className={vstack({ alignItems: 'flex-start', gap: '300', w: '100%' })}>
            <h3 className={css({ textStyle: 'headingSm', fontWeight: 'bold', color: 'text.base' })}>
              Feature walkthroughs
            </h3>
            <ol className={vstack({ alignItems: 'stretch', gap: '300', w: '100%', pl: '0' })}>
              {TOC_FEATURE_WALKTHROUGHS.map((item, i) => (
                <li key={item} className={hstack({ gap: '400', alignItems: 'flex-start' })}>
                  <span
                    className={css({
                      flexShrink: 0,
                      textStyle: 'bodyMd',
                      fontWeight: 'bold',
                      color: 'text.base',
                    })}
                  >
                    {i + 1}.
                  </span>
                  <span className={css({ textStyle: 'bodyMd', color: 'text.base' })}>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <h3 className={css({ textStyle: 'headingSm', fontWeight: 'bold', color: 'text.base' })}>
            Recap + next steps
          </h3>
        </div>
      </Card>

      <div className={hstack({ justifyContent: 'space-between' })}>
        <Button styleType="Tertiary" size="lg" startIcon={<IconArrowLeft size={3} />} onClick={onBack}>
          Back
        </Button>
        <Button styleType="Primary" size="lg" onClick={onStart}>
          Start prototype
        </Button>
      </div>
    </div>
  )
}

// ─── Agent experience: enhanced media email preview ──────────────────────────────

const INBOX_MESSAGES = [
  {
    id: 'enhanced-media',
    sender: 'realtor.com PRO',
    subject: 'Your listing now has enhanced media',
    snippet: 'Your team has added enhanced media to 456 Maple Drive...',
    time: '9:41 AM',
  },
  {
    id: '2',
    sender: 'Realtor.com PRO Support',
    subject: 'Your monthly performance report is ready',
    snippet: 'See how your listings performed in June...',
    time: '2 days ago',
  },
  {
    id: '3',
    sender: 'LeadConnect',
    subject: 'New lead: Sarah Chen is interested',
    snippet: 'A buyer has requested more info on a listing...',
    time: '3 days ago',
  },
  {
    id: '4',
    sender: 'MLS Connect',
    subject: 'Listing sync completed for 12 properties',
    snippet: 'Your MLS data has been synced successfully...',
    time: '5 days ago',
  },
  {
    id: '5',
    sender: 'DocuSign',
    subject: 'Please sign: Listing agreement',
    snippet: 'Bobby Martinez sent you a document to sign...',
    time: '1 week ago',
  },
]

// ─── Legacy listing detail page (destination when clicking the email) ────────────

const LEGACY_BLUE = '[#4052a2]'
const LEGACY_DARK = '[#181c24]'
const LEGACY_GRAY = '[#616f86]'
const LEGACY_BORDER = '[#e3e6e9]'
const LEGACY_BG = '[#f8f8f9]'
const LEGACY_INPUT_BORDER = '[#b9bfc9]'
const LEGACY_NAV_ACTIVE = '[#364bc4]'
const LEGACY_BREADCRUMB = '[#48566c]'
const LEGACY_RED = '[#d92228]'
const LEGACY_STRIPE = '[#6677d0]'

const LEGACY_NAV_ITEMS = ['Home', 'Contacts', 'Tasks', 'Listings', 'Listing presentations']
const LEGACY_NAV_DROPDOWNS = ['Profile', 'Performance', 'My Team', 'Products & Billing', 'Help']
const LEGACY_TABS = ['Performance', 'Matching buyers', 'Promotions', 'Listing details']

const LEGACY_RECOMMENDATIONS = [
  {
    title: 'Add at least 11 photos',
    description: 'Listings with at least 11 photos get more potential buyer interest',
    actions: ['Add here', 'Add on your MLS'],
    lift: '+5%',
  },
  {
    title: 'Add at least 1 school',
    description: 'Listings with the high school district/name attract more interest from potential buyers',
    actions: ['Add on your MLS'],
    lift: '+5%',
  },
  {
    title: 'Add HOA/Association fee amount',
    description: 'About 16% of buyers place value on knowing the homeowner association (HOA) fee amount',
    actions: ['Add on your MLS'],
    lift: '+2%',
  },
]

const LEGACY_PROPERTY_FACTS = [
  { label: 'property type', value: 'Single family' },
  { label: 'bed', value: '3' },
  { label: 'bath', value: '2.5' },
  { label: 'sqft', value: '1,870' },
  { label: 'sqft lot', value: '2,794' },
  { label: 'year built', value: '2007' },
]

const LEGACY_JUMP_LINKS = ['Description', 'Brokerage link', 'Virtual tour', 'Open houses', 'Photos']

const LEGACY_DESCRIPTION_TEXT =
  "Beautiful, loved, well-maintained 4-bedroom 2.5 bathroom South Austin home on .23480 of an acre lot! Spacious open floor plan with numerous upgrades throughout the home. Hard surface flooring on the entire first floor. This home has an office with French doors and a first floor flex room that could be used as you choose. The spacious open living and dining area lead you to the large backyard with an extended patio/deck, an outdoor kitchen, and a fire pit. A large walk-in closet with custom built in dressers and shelves. New HVAC 2021! Great location in desirable South Austin, a short drive to downtown, and shopping."

const LEGACY_OPEN_HOUSE_ROWS = [
  { date: '05/28/2022', start: '11:00 AM', end: '5:00 PM' },
  { date: '05/29/2022', start: '11:00 AM', end: '5:00 PM' },
]

function LegacyRadioRow({
  name,
  label,
  checked,
}: {
  name: string
  label: string
  checked: boolean
}) {
  return (
    <label className={hstack({ gap: '300', alignItems: 'center', cursor: 'pointer' })}>
      <input type="radio" name={name} defaultChecked={checked} />
      <span className={css({ fontSize: '[16px]', color: LEGACY_DARK })}>{label}</span>
    </label>
  )
}

function LegacyEditCard({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className={css({
        bg: 'white',
        borderRadius: '[16px]',
        p: { base: '500', md: '800' },
      })}
    >
      <h2 className={css({ fontSize: '[24px]', lineHeight: '[32px]', fontWeight: '600', color: LEGACY_DARK })}>
        {title}
      </h2>
      <p className={css({ fontSize: '[14px]', lineHeight: '[20px]', color: LEGACY_GRAY, mt: '300', maxW: '700px' })}>
        {description}
      </p>
      <div className={vstack({ alignItems: 'flex-start', gap: '400', mt: '600', w: '100%' })}>
        {children}
      </div>
    </div>
  )
}

function LegacyPhotoBanner() {
  return (
    <div
      className={hstack({
        gap: '300',
        alignItems: 'flex-start',
        bg: LEGACY_BG,
        borderRadius: '200',
        p: '500',
      })}
    >
      <IconInfo size={3} />
      <div className={vstack({ alignItems: 'flex-start', gap: '300' })}>
        <span className={css({ fontSize: '[16px]', fontWeight: '700', color: LEGACY_DARK })}>
          Changes to your photos have been made on your behalf
        </span>
        <span className={css({ fontSize: '[16px]', fontWeight: '400', color: LEGACY_DARK })}>
          Your team has updated your listing with enhanced media for Spotlight Listings. Any
          changes must be made by your team.
        </span>
      </div>
    </div>
  )
}

const LEGACY_FONT_STACK = '"Rubik", -apple-system, Helvetica, Arial, sans-serif'
const LEGACY_NAV_FONT_STACK = '"Roboto", -apple-system, Helvetica, Arial, sans-serif'

function LegacyFontOverride() {
  return (
    <style>{`
      [data-legacy-root], [data-legacy-root] * {
        font-family: ${LEGACY_FONT_STACK} !important;
      }
      [data-legacy-root] [data-legacy-nav], [data-legacy-root] [data-legacy-nav] * {
        font-family: ${LEGACY_NAV_FONT_STACK} !important;
      }
    `}</style>
  )
}

function LegacyEditListingModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      data-legacy-root
      className={css({
        position: 'fixed',
        inset: '0',
        zIndex: 'toast',
        bg: LEGACY_BG,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <LegacyFontOverride />
      {/* Header */}
      <div
        className={hstack({
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { base: '400', md: '800' },
          py: '600',
          bg: 'white',
          borderBottomWidth: '100',
          borderBottomStyle: 'solid',
          borderColor: LEGACY_BORDER,
          flexShrink: 0,
        })}
      >
        <span className={css({ fontSize: '[20px]', fontWeight: '500', color: LEGACY_DARK })}>
          Edit listing details
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={css({
            display: 'inline-flex',
            border: 'none',
            bg: 'transparent',
            cursor: 'pointer',
            color: LEGACY_DARK,
          })}
        >
          <IconClose size={3} />
        </button>
      </div>

      {/* Body */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          md: { flexDirection: 'row' },
          alignItems: 'flex-start',
          gap: { base: '500', md: '900' },
          flex: '1',
          px: { base: '400', sm: '600', md: '800' },
          py: { base: '500', md: '700' },
        })}
      >
        {/* Jump to nav */}
        <div
          className={css({
            display: { base: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '400',
            w: '160px',
            flexShrink: 0,
          })}
        >
          <span className={css({ fontSize: '[16px]', fontWeight: '600', color: LEGACY_DARK })}>
            Jump to:
          </span>
          {LEGACY_JUMP_LINKS.map((link) => (
            <a
              key={link}
              href={`#legacy-edit-${link.toLowerCase().replace(/\s+/g, '-')}`}
              className={css({
                fontSize: '[16px]',
                color: LEGACY_BLUE,
                textDecoration: 'underline',
                fontWeight: '500',
              })}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Content cards */}
        <div className={vstack({ alignItems: 'stretch', gap: '600', flex: '1', maxW: '760px' })}>
          <LegacyEditCard
            id="legacy-edit-description"
            title="Description"
            description="Edits to this description will show up on this listing on realtor.com. Edits to property specs such as bed and bath counts can be done only through your MLS."
          >
            <LegacyRadioRow name="description-source" label="Use description from MLS" checked={false} />
            <LegacyRadioRow name="description-source" label="Enter a custom description" checked />
            <div className={vstack({ alignItems: 'flex-start', gap: '200', w: '100%' })}>
              <span className={css({ fontSize: '[14px]', fontWeight: '500', color: LEGACY_DARK })}>
                Description
              </span>
              <textarea
                defaultValue={LEGACY_DESCRIPTION_TEXT}
                rows={7}
                className={css({
                  w: '100%',
                  borderWidth: '100',
                  borderStyle: 'solid',
                  borderColor: LEGACY_INPUT_BORDER,
                  borderRadius: '200',
                  px: '400',
                  py: '[15px]',
                  fontSize: '[16px]',
                  color: LEGACY_DARK,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                })}
              />
              <span className={css({ fontSize: '[12px]', fontWeight: '500', color: LEGACY_GRAY })}>
                {LEGACY_DESCRIPTION_TEXT.length}/2500 characters
              </span>
            </div>
          </LegacyEditCard>

          <LegacyEditCard
            id="legacy-edit-brokerage-link"
            title="Brokerage link"
            description={'This is a link to your brokerage firm’s website. It will appear in the "Brokered by" section of this listing on realtor.com.'}
          >
            <LegacyRadioRow name="brokerage-link-source" label="Use brokerage link from MLS" checked={false} />
            <LegacyRadioRow name="brokerage-link-source" label="Enter supported custom link" checked />
            <LegacyRadioRow name="brokerage-link-source" label="Don't show link on realtor.com®" checked={false} />
            <div className={vstack({ alignItems: 'flex-start', gap: '200', w: '100%' })}>
              <span className={css({ fontSize: '[14px]', fontWeight: '500', color: LEGACY_DARK })}>
                Brokerage URL
              </span>
              <input
                type="text"
                defaultValue="http://austinsouthwest.kwoffice.com"
                className={css({
                  w: '100%',
                  borderWidth: '100',
                  borderStyle: 'solid',
                  borderColor: LEGACY_INPUT_BORDER,
                  borderRadius: '200',
                  px: '400',
                  py: '[15px]',
                  fontSize: '[16px]',
                  color: LEGACY_DARK,
                })}
              />
            </div>
          </LegacyEditCard>

          <LegacyEditCard
            id="legacy-edit-virtual-tour"
            title="Virtual tour"
            description={'A link to a tour from Matterport, Asteroom, or CloudPano will appear as a "3D Tour" button on this listing on realtor.com®. A link to a video tour (YouTube or Vimeo) or virtual tour (personalized website) will appear as a "Virtual Tour" button.'}
          >
            <LegacyRadioRow name="tour-link-source" label="Use provided tour link from MLS" checked={false} />
            <LegacyRadioRow name="tour-link-source" label="Enter supported custom link" checked />
            <LegacyRadioRow name="tour-link-source" label="Don't show tour link on realtor.com®" checked={false} />
            <div className={vstack({ alignItems: 'flex-start', gap: '200', w: '100%' })}>
              <span className={css({ fontSize: '[14px]', fontWeight: '500', color: LEGACY_DARK })}>
                Tour URL
              </span>
              <input
                type="text"
                defaultValue="http://tour.kwarealty.com/123-Main-Street-Austin-TX-78701/"
                className={css({
                  w: '100%',
                  borderWidth: '100',
                  borderStyle: 'solid',
                  borderColor: LEGACY_INPUT_BORDER,
                  borderRadius: '200',
                  px: '400',
                  py: '[15px]',
                  fontSize: '[16px]',
                  color: LEGACY_DARK,
                })}
              />
            </div>
          </LegacyEditCard>

          <LegacyEditCard
            id="legacy-edit-open-houses"
            title="Open houses"
            description="Up to 4 upcoming open houses will appear on realtor.com®. Any more will be placed in a queue and added as older ones pass."
          >
            <div className={vstack({ alignItems: 'flex-start', gap: '100' })}>
              <span className={css({ fontSize: '[16px]', fontWeight: '600', color: LEGACY_DARK })}>
                Synced from MLS
              </span>
              <span className={css({ fontSize: '[16px]', color: LEGACY_GRAY })}>None</span>
            </div>

            {LEGACY_OPEN_HOUSE_ROWS.map((row, i) => (
              <div
                key={i}
                className={hstack({ gap: '500', alignItems: 'flex-end', flexWrap: 'wrap' })}
              >
                <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
                  <span className={css({ fontSize: '[14px]', fontWeight: '500', color: LEGACY_DARK })}>
                    Date
                  </span>
                  <div
                    className={hstack({
                      gap: '300',
                      alignItems: 'center',
                      borderWidth: '100',
                      borderStyle: 'solid',
                      borderColor: LEGACY_INPUT_BORDER,
                      borderRadius: '200',
                      px: '400',
                      py: '300',
                    })}
                  >
                    <span className={css({ fontSize: '[16px]', color: LEGACY_DARK })}>{row.date}</span>
                    <IconCalendar size={2} />
                  </div>
                </div>
                <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
                  <span className={css({ fontSize: '[14px]', fontWeight: '500', color: LEGACY_DARK })}>
                    Start time
                  </span>
                  <div
                    className={hstack({
                      gap: '300',
                      alignItems: 'center',
                      borderWidth: '100',
                      borderStyle: 'solid',
                      borderColor: LEGACY_INPUT_BORDER,
                      borderRadius: '200',
                      px: '400',
                      py: '300',
                    })}
                  >
                    <span className={css({ fontSize: '[16px]', color: LEGACY_DARK })}>{row.start}</span>
                    <IconChevronDown size={2} />
                  </div>
                </div>
                <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
                  <span className={css({ fontSize: '[14px]', fontWeight: '500', color: LEGACY_DARK })}>
                    End time
                  </span>
                  <div
                    className={hstack({
                      gap: '300',
                      alignItems: 'center',
                      borderWidth: '100',
                      borderStyle: 'solid',
                      borderColor: LEGACY_INPUT_BORDER,
                      borderRadius: '200',
                      px: '400',
                      py: '300',
                    })}
                  >
                    <span className={css({ fontSize: '[16px]', color: LEGACY_DARK })}>{row.end}</span>
                    <IconChevronDown size={2} />
                  </div>
                </div>
                <span
                  className={css({
                    fontSize: '[16px]',
                    fontWeight: '500',
                    color: LEGACY_BLUE,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    pb: '300',
                  })}
                >
                  Remove
                </span>
              </div>
            ))}

            <button
              type="button"
              className={css({
                borderWidth: '200',
                borderStyle: 'solid',
                borderColor: LEGACY_BLUE,
                color: LEGACY_BLUE,
                bg: 'white',
                fontWeight: '500',
                fontSize: '[14px]',
                borderRadius: '200',
                px: '600',
                py: '300',
                cursor: 'pointer',
              })}
            >
              + Add open house
            </button>
          </LegacyEditCard>

          <div
            id="legacy-edit-photos"
            className={css({
              bg: 'white',
              borderRadius: '[16px]',
              p: { base: '500', md: '800' },
            })}
          >
            <h2 className={css({ fontSize: '[24px]', lineHeight: '[32px]', fontWeight: '600', color: LEGACY_DARK })}>
              Photos
            </h2>
            <div className={hstack({ gap: '300', alignItems: 'center', flexWrap: 'wrap', mt: '500' })}>
              <IconPhotos size={3} />
              <span className={css({ fontSize: '[20px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                Current photo source: Team upload
              </span>
            </div>
            <div className={css({ mt: '500' })}>
              <LegacyPhotoBanner />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={hstack({
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { base: '400', md: '800' },
          py: '600',
          bg: 'white',
          borderTopWidth: '100',
          borderTopStyle: 'solid',
          borderColor: LEGACY_BORDER,
          flexShrink: 0,
        })}
      >
        <button
          type="button"
          onClick={onClose}
          className={css({
            border: 'none',
            bg: 'transparent',
            color: LEGACY_BLUE,
            fontWeight: '500',
            fontSize: '[16px]',
            textDecoration: 'underline',
            cursor: 'pointer',
          })}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          className={css({
            border: 'none',
            bg: LEGACY_RED,
            color: 'white',
            fontWeight: '700',
            fontSize: '[16px]',
            borderRadius: '200',
            px: '600',
            py: '500',
            cursor: 'pointer',
          })}
        >
          Publish changes
        </button>
      </div>
    </div>
  )
}

function LegacyListingDetailPage({ onBack }: { onBack: () => void }) {
  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <div data-legacy-root className={css({ minH: '100dvh', bg: LEGACY_BG })}>
      <LegacyFontOverride />
      {showEditModal && <LegacyEditListingModal onClose={() => setShowEditModal(false)} />}
      {/* Utility bar */}
      <div
        data-legacy-nav
        className={css({
          bg: '[rgba(0,0,0,0.8)]',
          color: 'white',
          opacity: '[0.8]',
          fontSize: '[12px]',
          fontWeight: '300',
          px: '700',
          py: '300',
        })}
      >
        realtor.com® home page
      </div>
      <div className={css({ h: '4px', bg: LEGACY_STRIPE })} />

      {/* Header */}
      <div
        data-legacy-nav
        className={hstack({
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '300',
          px: { base: '400', md: '700' },
          py: '500',
          bg: 'white',
          borderBottomWidth: '100',
          borderBottomStyle: 'solid',
          borderColor: '[rgba(0,0,0,0.2)]',
        })}
      >
        <div className={hstack({ gap: '300', alignItems: 'center' })}>
          <LogoBrand style={{}} className={css({ h: '22px', display: 'block' })} />
          <span className={css({ fontSize: '[16px]', color: LEGACY_GRAY })}>for Professionals</span>
        </div>
        <div className={hstack({ gap: '300', alignItems: 'center' })}>
          <div className={vstack({ alignItems: 'flex-end', gap: '0' })}>
            <span className={css({ fontSize: '[12px]', fontWeight: '300', color: '[black]', opacity: '[0.9]' })}>
              Welcome
            </span>
            <span className={css({ fontSize: '[14px]', fontWeight: '400', color: '[black]', opacity: '[0.9]' })}>
              Agent
            </span>
          </div>
          <div
            className={css({
              w: '40px',
              h: '40px',
              borderWidth: '100',
              borderStyle: 'solid',
              borderColor: '[rgba(0,0,0,0.1)]',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '[rgba(0,0,0,0.4)]',
            })}
          >
            <IconProfile size={3} />
          </div>
        </div>
      </div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          md: { flexDirection: 'row' },
          alignItems: 'stretch',
          gap: '0',
        })}
      >
        {/* Sidebar */}
        <div
          data-legacy-nav
          className={css({
            w: { base: '100%', md: '256px' },
            flexShrink: 0,
            bg: 'white',
            borderRightWidth: { base: '0', md: '100' },
            borderRightStyle: 'solid',
            borderBottomWidth: { base: '100', md: '0' },
            borderBottomStyle: 'solid',
            borderColor: LEGACY_BORDER,
            py: '600',
            minH: { base: 'auto', md: 'calc(100dvh - 76px)' },
          })}
        >
          {LEGACY_NAV_ITEMS.map((item) => (
            <div
              key={item}
              className={css({
                px: '700',
                py: '400',
                fontSize: '[16px]',
                fontWeight: item === 'Listings' ? '600' : '400',
                color: item === 'Listings' ? LEGACY_NAV_ACTIVE : '[black]',
                opacity: '[0.9]',
              })}
            >
              {item}
            </div>
          ))}
          <div className={css({ h: '1px', bg: '[rgba(0,0,0,0.1)]', my: '400' })} />
          {LEGACY_NAV_DROPDOWNS.map((item) => (
            <div
              key={item}
              className={hstack({
                justifyContent: 'space-between',
                alignItems: 'center',
                px: '700',
                py: '400',
              })}
            >
              <span className={css({ fontSize: '[16px]', color: '[black]', opacity: '[0.9]' })}>
                {item}
              </span>
              <IconChevronDown size={2} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div
          className={css({
            flex: '1',
            minW: '0',
            px: { base: '400', sm: '600', md: '900' },
            py: { base: '500', md: '700' },
          })}
        >
          {/* Back link + actions */}
          <div
            className={hstack({
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '300',
              mb: '700',
            })}
          >
            <button
              type="button"
              onClick={onBack}
              className={hstack({
                gap: '200',
                alignItems: 'center',
                color: LEGACY_BREADCRUMB,
                cursor: 'pointer',
                border: 'none',
                bg: 'transparent',
              })}
            >
              <IconArrowLeft size={3} />
              <span className={css({ fontSize: '[18px]', fontWeight: '500', letterSpacing: '[0.18px]' })}>
                All Listings
              </span>
            </button>
            <div className={hstack({ gap: '400' })}>
              <button
                type="button"
                className={css({
                  borderWidth: '200',
                  borderStyle: 'solid',
                  borderColor: LEGACY_BLUE,
                  color: LEGACY_BLUE,
                  bg: 'white',
                  fontWeight: '500',
                  fontSize: '[14px]',
                  borderRadius: '200',
                  px: '600',
                  py: '400',
                  cursor: 'pointer',
                })}
              >
                Edit listing
              </button>
              <button
                type="button"
                className={css({
                  borderWidth: '200',
                  borderStyle: 'solid',
                  borderColor: LEGACY_BLUE,
                  color: LEGACY_BLUE,
                  bg: 'white',
                  fontWeight: '500',
                  fontSize: '[14px]',
                  borderRadius: '200',
                  px: '600',
                  py: '400',
                  cursor: 'pointer',
                })}
              >
                Share report
              </button>
            </div>
          </div>

          {/* Property header */}
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              xs: { flexDirection: 'row' },
              gap: '500',
              alignItems: 'flex-start',
              mb: '700',
            })}
          >
            <div className={css({ position: 'relative', flexShrink: 0 })}>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=240&h=180&fit=crop"
                alt=""
                className={css({ w: '190px', h: '126px', borderRadius: '200', objectFit: 'cover', display: 'block' })}
              />
              <div
                className={hstack({
                  gap: '100',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: '200',
                  right: '200',
                  bg: '[rgba(51,51,51,0.75)]',
                  color: 'white',
                  borderRadius: '[100px]',
                  px: '300',
                  py: '100',
                })}
              >
                <IconCamera size={2} />
                <span className={css({ fontSize: '[14px]', fontWeight: '500' })}>10</span>
              </div>
            </div>
            <div className={vstack({ alignItems: 'flex-start', gap: '200' })}>
              <h1
                className={css({
                  fontSize: '[28px]',
                  lineHeight: '[36px]',
                  fontWeight: '600',
                  color: LEGACY_DARK,
                })}
              >
                123 Main Street, Austin, TX 78731
              </h1>
              <div className={hstack({ gap: '400', alignItems: 'center', flexWrap: 'wrap' })}>
                <span className={css({ fontSize: '[16px]', color: LEGACY_GRAY })}>
                  BrightMLS 12345678
                </span>
                <span className={css({ fontSize: '[16px]', color: LEGACY_GRAY })}>$565,000</span>
                <span className={css({ fontSize: '[16px]', color: LEGACY_GRAY })}>
                  Listed: Oct 1, 2022
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={hstack({
              gap: '700',
              borderBottomWidth: '100',
              borderBottomStyle: 'solid',
              borderColor: LEGACY_BORDER,
              mb: '700',
              overflowX: 'auto',
              flexShrink: '0',
            })}
          >
            {LEGACY_TABS.map((tab) => {
              const active = tab === 'Listing details'
              return (
                <span
                  key={tab}
                  className={css({
                    fontSize: '[16px]',
                    fontWeight: active ? '500' : '400',
                    color: active ? LEGACY_DARK : LEGACY_GRAY,
                    pb: '400',
                    borderBottomWidth: active ? '[4px]' : '0',
                    borderBottomStyle: 'solid',
                    borderColor: LEGACY_DARK,
                    whiteSpace: 'nowrap',
                    flexShrink: '0',
                  })}
                >
                  {tab}
                </span>
              )
            })}
          </div>

          {/* Listing completeness card */}
          <div
            className={css({
              bg: 'white',
              borderWidth: '100',
              borderStyle: 'solid',
              borderColor: LEGACY_BORDER,
              borderRadius: '[16px]',
              p: { base: '500', md: '800' },
              mb: '600',
            })}
          >
            <h2 className={css({ fontSize: '[24px]', lineHeight: '[32px]', fontWeight: '600', color: LEGACY_DARK })}>
              Listing completeness
            </h2>
            <p className={css({ fontSize: '[14px]', lineHeight: '[18px]', color: LEGACY_GRAY, mt: '300' })}>
              Complete the recommended actions to help increase the attention your listing gets
              from potenitial buyers.{' '}
              <span className={css({ color: LEGACY_BLUE, textDecoration: 'underline' })}>
                How does this work?
              </span>
            </p>

            <p
              className={css({
                fontSize: '[16px]',
                lineHeight: '[24px]',
                fontWeight: '600',
                color: LEGACY_DARK,
                mt: '600',
              })}
            >
              88% complete (8 of 11)
            </p>
            <div
              className={css({
                h: '18px',
                bg: LEGACY_BORDER,
                borderRadius: '[18px]',
                overflow: 'hidden',
                mt: '300',
              })}
            >
              <div className={css({ h: '100%', w: '[83.33%]', bg: '[#2bb673]' })} />
            </div>

            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                xs: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                gap: '200',
                mt: '700',
                mb: '400',
              })}
            >
              <div className={hstack({ gap: '200', alignItems: 'center' })}>
                <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                  Recommended (3)
                </span>
                <IconChevronUp size={2} />
              </div>
              <span className={css({ fontSize: '[14px]', color: LEGACY_GRAY })}>
                Any changes made in MLS will take ~15 min to appear
              </span>
            </div>

            <div className={vstack({ alignItems: 'stretch', gap: '400' })}>
              {LEGACY_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.title}
                  className={css({
                    borderWidth: '100',
                    borderStyle: 'solid',
                    borderColor: LEGACY_INPUT_BORDER,
                    borderRadius: '200',
                    p: '500',
                  })}
                >
                  <div
                    className={hstack({
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '200',
                    })}
                  >
                    <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '500', color: LEGACY_DARK })}>
                      {rec.title}
                    </span>
                    <div className={hstack({ gap: '400', alignItems: 'center', flexWrap: 'wrap' })}>
                      {rec.actions.map((action) => (
                        <span
                          key={action}
                          className={css({
                            fontSize: '[16px]',
                            lineHeight: '[24px]',
                            fontWeight: '500',
                            color: LEGACY_BLUE,
                            textDecoration: 'underline',
                            whiteSpace: 'nowrap',
                          })}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={hstack({
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap',
                      gap: '200',
                      mt: '200',
                    })}
                  >
                    <span className={css({ fontSize: '[14px]', color: LEGACY_GRAY })}>
                      {rec.description}
                    </span>
                    <span className={css({ fontSize: '[14px]', color: LEGACY_GRAY, whiteSpace: 'nowrap' })}>
                      {rec.lift}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={hstack({ gap: '200', alignItems: 'center', mt: '600' })}>
              <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                Completed (8)
              </span>
              <IconChevronDown size={2} />
            </div>
          </div>

          {/* Listing details and photos card */}
          <div
            className={css({
              bg: 'white',
              borderWidth: '100',
              borderStyle: 'solid',
              borderColor: LEGACY_BORDER,
              borderRadius: '[16px]',
              p: { base: '500', md: '800' },
            })}
          >
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                xs: { flexDirection: 'row', justifyContent: 'space-between' },
                gap: '400',
              })}
            >
              <div>
                <h2 className={css({ fontSize: '[24px]', lineHeight: '[32px]', fontWeight: '600', color: LEGACY_DARK })}>
                  Listing details and photos
                </h2>
                <p className={css({ fontSize: '[14px]', lineHeight: '[20px]', color: LEGACY_GRAY, mt: '300', maxW: '600px' })}>
                  This information is pulled in automatically from your MLS and any edits will
                  show up only on your listing on our site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className={css({
                  borderWidth: '200',
                  borderStyle: 'solid',
                  borderColor: LEGACY_BLUE,
                  color: LEGACY_BLUE,
                  bg: 'white',
                  fontWeight: '500',
                  fontSize: '[14px]',
                  borderRadius: '200',
                  px: '600',
                  py: '300',
                  cursor: 'pointer',
                  flexShrink: 0,
                })}
              >
                Edit
              </button>
            </div>

            {/* Description */}
            <div className={vstack({ alignItems: 'flex-start', gap: '300', mt: '700' })}>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <IconClipboard size={3} />
                <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                  Description
                </span>
              </div>
              <p className={css({ fontSize: '[16px]', lineHeight: '[24px]', color: LEGACY_GRAY, maxW: '900px' })}>
                Beautiful, loved, well-maintained 3-bedroom 2.5 bathroom South Austin home on
                .23480 of an acre lot! Spacious open floor plan with numerous upgrades...{' '}
                <span className={css({ color: LEGACY_BLUE, textDecoration: 'underline' })}>
                  Show more
                </span>
              </p>
              <div className={hstack({ gap: '700', flexWrap: 'wrap' })}>
                {LEGACY_PROPERTY_FACTS.map((fact) => (
                  <div key={fact.label} className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                    <span className={css({ fontSize: '[16px]', lineHeight: '[22px]', fontWeight: '500', color: LEGACY_DARK })}>
                      {fact.value}
                    </span>
                    <span className={css({ fontSize: '[16px]', lineHeight: '[22px]', color: LEGACY_GRAY })}>
                      {fact.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brokerage link */}
            <div className={vstack({ alignItems: 'flex-start', gap: '300', mt: '700' })}>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <IconLink size={3} />
                <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                  Brokerage link
                </span>
              </div>
              <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', color: LEGACY_BLUE, textDecoration: 'underline' })}>
                http://austinsouthwest.kwoffice.com
              </span>
            </div>

            {/* Tour */}
            <div className={vstack({ alignItems: 'flex-start', gap: '300', mt: '700' })}>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <IconPlay size={3} />
                <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                  3D, Video, or Virtual Tour
                </span>
              </div>
              <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', color: LEGACY_BLUE, textDecoration: 'underline' })}>
                http://tour.kwarealty.com/123-Main-Street-Austin-YX-78701/
              </span>
            </div>

            {/* Open houses */}
            <div className={vstack({ alignItems: 'flex-start', gap: '300', mt: '700' })}>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <IconOpenHouse size={3} />
                <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                  Open houses (2)
                </span>
              </div>
              <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', color: LEGACY_GRAY })}>
                Saturday, Oct 15, 2022  11am-5pm
              </span>
              <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', color: LEGACY_GRAY })}>
                Sunday, Oct 16, 2022  11am-5pm
              </span>
            </div>

            {/* Photos */}
            <div className={vstack({ alignItems: 'flex-start', gap: '300', mt: '700' })}>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <IconPhotos size={3} />
                <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', fontWeight: '600', color: LEGACY_DARK })}>
                  Photos
                </span>
              </div>
              <span className={css({ fontSize: '[16px]', lineHeight: '[24px]', color: LEGACY_GRAY })}>
                Current photo source: Team upload
              </span>
              <div className={css({ w: '100%', mt: '300' })}>
                <LegacyPhotoBanner />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EnhancedMediaEmailPreview() {
  const [showListingDetail, setShowListingDetail] = useState(false)

  if (showListingDetail) {
    return <LegacyListingDetailPage onBack={() => setShowListingDetail(false)} />
  }

  return (
    <div
      className={css({
        h: '100dvh',
        w: '100%',
        bg: 'bg.base',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <div
        className={css({
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        })}
      >
        {/* Inbox toolbar */}
        <div
          className={hstack({
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '600',
            py: '400',
            borderBottomWidth: '100',
            borderBottomStyle: 'solid',
            borderColor: 'border.base',
            flexShrink: 0,
          })}
        >
          <span className={css({ textStyle: 'headingSm', color: 'text.base' })}>Inbox</span>
          <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
            user.name@email.com
          </span>
        </div>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            md: { flexDirection: 'row' },
            alignItems: 'stretch',
            flex: '1',
            overflow: 'hidden',
          })}
        >
          {/* Message list */}
          <div
            className={css({
              w: { base: '100%', md: '320px' },
              maxH: { base: '200px', md: 'none' },
              flexShrink: 0,
              overflowY: 'auto',
              borderRightWidth: { base: '0', md: '100' },
              borderRightStyle: 'solid',
              borderBottomWidth: { base: '100', md: '0' },
              borderBottomStyle: 'solid',
              borderColor: 'border.base',
            })}
          >
            {INBOX_MESSAGES.map((msg) => {
              const active = msg.id === 'enhanced-media'
              return (
                <div
                  key={msg.id}
                  className={css({
                    px: '500',
                    py: '400',
                    borderBottomWidth: '100',
                    borderBottomStyle: 'solid',
                    borderColor: 'border.base',
                    bg: active ? 'bg.alternate' : 'bg.base',
                  })}
                >
                  <div className={hstack({ justifyContent: 'space-between', alignItems: 'center' })}>
                    <span
                      className={css({
                        textStyle: 'bodySm',
                        fontWeight: active ? 'bold' : 'medium',
                        color: 'text.base',
                      })}
                    >
                      {msg.sender}
                    </span>
                    <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                      {msg.time}
                    </span>
                  </div>
                  <p
                    className={css({
                      textStyle: 'bodySm',
                      fontWeight: active ? 'medium' : 'normal',
                      color: 'text.base',
                      mt: '100',
                    })}
                  >
                    {msg.subject}
                  </p>
                  <p
                    className={css({
                      textStyle: 'caption',
                      color: 'text.alternate',
                      mt: '100',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    })}
                  >
                    {msg.snippet}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Reading pane */}
          <div className={css({ flex: '1', overflowY: 'auto' })}>
            {/* Message header */}
            <div
              className={vstack({
                alignItems: 'flex-start',
                gap: '300',
                px: { base: '400', md: '700' },
                py: '600',
                borderBottomWidth: '100',
                borderBottomStyle: 'solid',
                borderColor: 'border.base',
              })}
            >
              <h2 className={css({ textStyle: 'headingSm', color: 'text.base' })}>
                Your listing now has enhanced media
              </h2>
              <div className={hstack({ gap: '300', alignItems: 'center' })}>
                <Avatar size="xs" initials="RP" />
                <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                  <span
                    className={css({ textStyle: 'bodySm', fontWeight: 'medium', color: 'text.base' })}
                  >
                    realtor.com PRO
                  </span>
                  <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                    to user.name@email.com
                  </span>
                </div>
                <span
                  className={css({ textStyle: 'caption', color: 'text.alternate', ml: 'auto' })}
                >
                  9:41 AM
                </span>
              </div>
            </div>

            {/* Email content — clicking anywhere opens the listing detail page */}
            <div
              onClick={() => setShowListingDetail(true)}
              className={css({ cursor: 'pointer' })}
            >
            {/* Email body — constrained to the original design width, centered in the pane */}
            <div className={vstack({ alignItems: 'center', w: '100%' })}>
            <div className={css({ w: '100%', maxW: '600px' })}>
            <div
              className={vstack({
                alignItems: 'center',
                gap: '700',
                px: { base: '400', md: '700' },
                py: { base: '700', md: '1400' },
              })}
            >
          <LogoRealtorProDefault className={css({ h: '32px', display: 'block' })} />

          <div className={vstack({ alignItems: 'flex-start', gap: '500', w: '100%' })}>
            <h1
              className={css({
                textStyle: 'headingLg',
                fontWeight: 'bold',
                color: 'text.base',
              })}
            >
              Enhanced media has been added to your listing
            </h1>

            <div className={vstack({ alignItems: 'flex-start', gap: '400' })}>
              <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>[Agent name],</p>
              <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
                Your team has added enhanced media to [Listing address]. Buyers will now see
                these photos on the listing.
              </p>
              <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
                Since your team manages this listing's media, any future photo changes need to
                go through them directly.
              </p>
            </div>

            <button
              type="button"
              className={css({
                w: '100%',
                bg: 'status.error',
                color: 'text.inverse',
                textStyle: 'bodyMd',
                fontWeight: 'bold',
                borderRadius: '500',
                py: '500',
                textAlign: 'center',
                cursor: 'pointer',
                border: 'none',
              })}
            >
              View your listing
            </button>
          </div>
        </div>
            </div>
            </div>

        {/* Footer — full-bleed background, content constrained to the design width */}
        <div
          className={vstack({
            alignItems: 'center',
            gap: '500',
            bg: 'bg.inverse',
            color: 'text.inverse',
            w: '100%',
            px: { base: '400', md: '700' },
            py: { base: '600', md: '900' },
          })}
        >
          <div className={vstack({ alignItems: 'center', gap: '500', w: '100%', maxW: '600px' })}>
          <LogoBrandWhite className={css({ h: '24px', display: 'block' })} />
          <span className={css({ textStyle: 'bodySm', fontWeight: 'bold' })}>
            #1 site real estate professionals trust
          </span>

          <div className={vstack({ alignItems: 'center', gap: '300', mt: '400' })}>
            <span className={css({ textStyle: 'bodySm' })}>901 E 6th St, Austin, TX 78702</span>
            <div className={hstack({ gap: '300', flexWrap: 'wrap', justifyContent: 'center' })}>
              <span className={css({ textStyle: 'bodySm', textDecoration: 'underline' })}>
                Terms of Use
              </span>
              <span className={css({ textStyle: 'bodySm' })}>|</span>
              <span className={css({ textStyle: 'bodySm', textDecoration: 'underline' })}>
                Privacy
              </span>
              <span className={css({ textStyle: 'bodySm' })}>|</span>
              <span className={css({ textStyle: 'bodySm', textDecoration: 'underline' })}>
                Equal Housing
              </span>
            </div>
          </div>

          <p
            className={css({
              textStyle: 'caption',
              fontStyle: 'italic',
              textAlign: 'center',
              mt: '400',
            })}
          >
            To unsubscribe from transactional emails, you must cancel your subscription.
          </p>

          <p className={css({ textStyle: 'caption', textAlign: 'center' })}>
            Move Sales, Inc. does not use any National Association of REALTORS dues to operate
            and maintain Realtor.com©.
          </p>

          <p className={css({ textStyle: 'caption', textAlign: 'center' })}>
            REALTOR® and Realtor.com® are trademarks of the NATIONAL ASSOCIATION OF REALTORS®
            <br />
            and are used with its permission. © 2025 Move, Inc. All rights reserved.
          </p>
        </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Consumer listing detail page (realtor.com) ──────────────────────────────────

/**
 * The four enhanced-media tiles that sit beside the hero. Generated from the
 * agent's uploaded photos, so they only appear once photos exist.
 */
const CONSUMER_MEDIA_TILES = [
  { label: 'Kitchen', src: PHOTO_KITCHEN },
  { label: 'Bathrooms', src: PHOTO_PRIMARY_BATHROOM },
  { label: 'Bedrooms', src: PHOTO_PRIMARY_BEDROOM },
  { label: 'FlyAround', src: PHOTO_AERIAL },
]

/**
 * Renovation styles offered in the "See yourself in this home" module. Every
 * `src` is a re-render of CONSUMER_RENOVATE_BEFORE, which is what lets the
 * before/after slider compare the same room.
 */
const CONSUMER_STYLE_TILES = [
  { label: 'Traditional', src: RENDER_TRADITIONAL },
  { label: 'Contemporary', src: RENDER_CONTEMPORARY },
  { label: 'Modern', src: RENDER_MODERN },
  { label: 'Scandi', src: RENDER_SCANDI },
  { label: 'Industrial', src: RENDER_INDUSTRIAL },
  { label: 'Farmhouse', src: RENDER_FARMHOUSE },
]

/** The un-renovated room the style renders are generated from. */
const CONSUMER_RENOVATE_BEFORE = PHOTO_LIVING_ROOM

/**
 * The renders are all ~849x434, so the module is sized to them — that way the
 * "after" is never cropped and only the taller "before" gives up some height.
 */
const CONSUMER_RENOVATE_ASPECT = '849 / 434'

/** Shown once a render exists, per the design's stronger disclosure. */
const CONSUMER_RENOVATE_DISCLAIMER =
  "Computer Generated Design Concept. This visualization is for inspiration only and does not depict the property's actual condition. Results are illustrative and may vary from actual property details. Not a representation of renovation feasibility or cost."

const CONSUMER_HOME_FACTS = [
  { icon: <IconHome size={3} />, value: 'Single family', caption: 'Property type' },
  { icon: <IconSquareFootage size={3} />, value: '$553', caption: 'Price per sqft' },
  { icon: <IconGarage size={3} />, value: '2 cars', caption: 'Garage' },
  { icon: <IconHoa size={3} />, value: '$33/mo', caption: 'HOA fees' },
  { icon: <IconCalendar size={3} />, value: '11 days', caption: 'On Realtor.com' },
  { icon: <IconHammer size={3} />, value: '2017', caption: 'Year built' },
]

const CONSUMER_PROMPT_CHIPS = [
  "What's nearby?",
  'Recent renovation & improvements',
  'Compare this home',
  'Ask a question',
]

const CONSUMER_DESCRIPTION =
  'Set well back from the street on a beautifully mature lot, this architect-designed home pairs warm cedar siding with generous walls of glass and a deep, welcoming front porch. The landscaped grounds include vibrant native plantings, established shade trees, and a stone patio built for long evenings outdoors. Inside, wide-plank white oak floors run through an open kitchen with honed marble counters, a butler’s pantry, and a sunlit breakfast nook overlooking the gardens. The primary suite occupies its own wing with a spa bath and a private terrace.'

/** Small dark pill used for the "1/24" counters over media. */
function MediaCounter({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={css({
        position: 'absolute',
        // 16px inset and a 36px-tall pill, per the LDP frame.
        top: '500',
        right: '500',
        px: '500',
        py: '6px',
        borderRadius: 'full',
        bg: 'rgba(26, 24, 22, 0.72)',
        color: 'white',
        textStyle: 'bodyMd',
        fontWeight: 'medium',
      })}
    >
      {children}
    </span>
  )
}

/** Circular overlay control for carousel prev/next and play/pause. */
function MediaControl({
  label,
  onClick,
  children,
  css: cssProp,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  css?: Parameters<typeof css>[0]
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={css(
        {
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          w: '48px',
          h: '48px',
          borderRadius: 'full',
          bg: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          _hover: { bg: 'rgba(0, 0, 0, 0.78)' },
        },
        cssProp
      )}
    >
      {children}
    </button>
  )
}

/** Fills the media frame it is positioned inside of. */
const mediaFillImage = css({
  position: 'absolute',
  inset: '0',
  w: '100%',
  h: '100%',
  objectFit: 'cover',
  display: 'block',
})

/**
 * Draggable before/after comparison. The "after" fills the frame and the
 * "before" is clipped to the left of the divider, so dragging the handle wipes
 * the renovation away. Mount with a `key` per style so each new render starts
 * back at the middle.
 */
function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  afterAlt,
}: {
  beforeSrc: string
  afterSrc: string
  afterAlt: string
}) {
  const [pct, setPct] = useState(50)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setPct(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX)
  }

  const endDrag = () => {
    dragging.current = false
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : 0
    if (delta === 0) return
    e.preventDefault()
    setPct((p) => Math.min(100, Math.max(0, p + delta)))
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={css({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '300',
        aspectRatio: CONSUMER_RENOVATE_ASPECT,
        bg: 'bg.alternate',
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'ew-resize',
      })}
    >
      <img src={afterSrc} alt={afterAlt} draggable={false} className={mediaFillImage} />
      <img
        src={beforeSrc}
        alt="The same room as it looks today"
        draggable={false}
        className={mediaFillImage}
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      />
      <div
        aria-hidden
        className={css({
          position: 'absolute',
          top: '0',
          bottom: '0',
          w: '2px',
          ml: '-1px',
          bg: 'white',
        })}
        style={{ left: `${pct}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare this room before and after renovation"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)}% of the original photo shown`}
        onKeyDown={handleKeyDown}
        className={css({
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          w: '48px',
          h: '48px',
          borderRadius: 'full',
          bg: 'white',
          color: 'text.base',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.28)',
          cursor: 'ew-resize',
        })}
        style={{ left: `${pct}%` }}
      >
        <IconChevronLeft size={2} />
        <IconChevronRight size={2} />
      </div>
    </div>
  )
}

function ConsumerLdpScreen({ listing, onBack }: { listing: Listing; onBack: () => void }) {
  // Fall back to the listing's own hero shot so the page still renders if it is
  // reached before any photos were uploaded.
  const heroPhotos = listing.uploadedPhotos.length > 0 ? listing.uploadedPhotos : [listing.photo]
  // The main spot opens on the generated walkthrough video; the agent's photos
  // sit behind it in the same carousel.
  const heroMedia: { kind: 'video' | 'photo'; src: string }[] = [
    { kind: 'video', src: WALKTHROUGH_VIDEO_URL },
    ...heroPhotos.map((src) => ({ kind: 'photo' as const, src })),
  ]
  const [heroIndex, setHeroIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const heroItem = heroMedia[heroIndex]
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  // Picking a tile only stages a choice — `selectedStyleIndex`. Nothing renders
  // until Renovate is pressed, at which point `generating` holds the in-flight
  // request and `styleIndex` holds whatever came back. `generating` is an object
  // so every request is a distinct value, even for the same style twice running.
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null)
  const [styleIndex, setStyleIndex] = useState<number | null>(null)
  const [generating, setGenerating] = useState<{ index: number } | null>(null)
  const [descExpanded, setDescExpanded] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Photos advance on their own until the buyer pauses. The video is left alone
  // — it loops for as long as the buyer wants to watch it.
  useEffect(() => {
    if (!playing || heroItem.kind === 'video' || heroMedia.length < 2) return
    const id = window.setInterval(
      () => setHeroIndex((i) => (i + 1) % heroMedia.length),
      3500
    )
    return () => window.clearInterval(id)
  }, [playing, heroItem.kind, heroMedia.length])

  // One play/pause control drives both media types, so the video has to follow
  // `playing` rather than just its own autoplay attribute.
  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    if (playing) {
      // A browser can still refuse to start it; the buyer then presses play.
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [playing, heroIndex])

  const step = (delta: number) => {
    setPlaying(false)
    setHeroIndex((i) => (i + delta + heroMedia.length) % heroMedia.length)
  }

  // Stand-in for the render round trip.
  useEffect(() => {
    if (!generating) return
    const id = window.setTimeout(() => {
      setStyleIndex(generating.index)
      setGenerating(null)
    }, 2000)
    return () => window.clearTimeout(id)
  }, [generating])

  const generateStyle = (index: number) => {
    // Drop the current render first so the generating state can't be mistaken
    // for a finished one.
    setStyleIndex(null)
    setGenerating({ index })
  }

  const totalMedia = 24
  const activeStyle = styleIndex === null ? null : CONSUMER_STYLE_TILES[styleIndex]

  return (
    <div className={css({ bg: 'bg.base', minH: '100dvh', pb: '900' })}>
      {/* Consumer header — doubles as the way back into the PRO prototype */}
      <div
        className={css({
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bg: 'bg.base',
          borderBottomWidth: '100',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border.base',
          px: { base: '400', md: '600' },
          h: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '400',
        })}
      >
        <Button
          styleType="Ghost"
          size="sm"
          startIcon={<IconChevronLeft size={3} />}
          onClick={onBack}
        >
          Search
        </Button>
        <LogoBrand height={24} />
        <div className={hstack({ gap: '200', alignItems: 'center' })}>
          <Button styleType="Secondary" size="sm" iconOnly={<IconHeart size={3} />} aria-label="Save" />
          <Button styleType="Secondary" size="sm" iconOnly={<IconShare size={3} />} aria-label="Share" />
          <Button
            styleType="Secondary"
            size="sm"
            iconOnly={<IconHomeSlash size={3} />}
            aria-label="Hide"
          />
        </div>
      </div>

      {/* Hero + enhanced media tiles */}
      <div
        className={css({
          display: 'grid',
          // The design splits 1328px of content into an 864px hero and a 464px
          // tile column, so the tracks carry those figures rather than a rounded
          // 2:1 — at 2:1 the square tiles come up 27px short of the hero.
          gridTemplateColumns: { base: '1fr', lg: '864fr 464fr' },
          gap: '100',
          // Full bleed, flush under the header, exactly as the frame has it.
          px: '0',
          pt: '0',
          maxW: '1728px',
          mx: 'auto',
        })}
      >
        <div
          className={css({
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '864 / 457',
            bg: 'bg.alternate',
          })}
        >
          {heroItem.kind === 'video' ? (
            <video
              ref={heroVideoRef}
              src={heroItem.src}
              // Muted and inline is what lets the walkthrough start by itself —
              // browsers block autoplay that would make noise.
              autoPlay
              muted
              loop
              playsInline
              className={css({ w: '100%', h: '100%', objectFit: 'cover', display: 'block' })}
            />
          ) : (
            <img
              src={heroItem.src}
              alt=""
              className={css({ w: '100%', h: '100%', objectFit: 'cover', display: 'block' })}
            />
          )}

          <div className={css({ position: 'absolute', top: '500', left: '500' })}>
            <Tag dataColor="blue" startIcon={<IconZap size={2} />}>
              Spotlight
            </Tag>
          </div>

          <MediaCounter>
            {heroIndex + 1}/{totalMedia}
          </MediaCounter>

          {heroMedia.length > 1 && (
            <>
              <MediaControl
                label="Previous photo"
                onClick={() => step(-1)}
                css={{ left: '500', top: '50%', transform: 'translateY(-50%)' }}
              >
                <IconChevronLeft size={3} />
              </MediaControl>
              <MediaControl
                label="Next photo"
                onClick={() => step(1)}
                css={{ right: '500', top: '50%', transform: 'translateY(-50%)' }}
              >
                <IconChevronRight size={3} />
              </MediaControl>
              <MediaControl
                label={playing ? 'Pause walkthrough' : 'Play walkthrough'}
                onClick={() => setPlaying((p) => !p)}
                css={{ bottom: '500', left: '50%', transform: 'translateX(-50%)' }}
              >
                {playing ? <IconPauseFilled size={3} /> : <IconPlay size={3} />}
              </MediaControl>
            </>
          )}

          <p
            className={css({
              position: 'absolute',
              bottom: '300',
              right: '300',
              maxW: '310px',
              textAlign: 'right',
              textStyle: 'caption',
              color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)',
            })}
          >
            Computer generated by Realtor.com based on listing photos. For illustrative purposes only
            and may not be accurate.
          </p>
        </div>

        {/* 2×2 grid of generated room media */}
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            // The frame separates the tiles with 2px white borders on each side
            // of every seam, so the seams read as 4px.
            gap: '200',
          })}
        >
          {CONSUMER_MEDIA_TILES.map((tile) => (
            <button
              key={tile.label}
              type="button"
              className={css({
                position: 'relative',
                overflow: 'hidden',
                // No fixed ratio: the tiles fill their tracks, which is what
                // makes the block bottom-align with the hero. At the design's
                // column widths that lands them on the frame's 232×228.
                h: '100%',
                bg: 'bg.alternate',
                border: 'none',
                p: '0',
                cursor: 'pointer',
                display: 'block',
              })}
            >
              <img
                src={tile.src}
                alt=""
                className={css({ w: '100%', h: '100%', objectFit: 'cover', display: 'block' })}
              />
              <span
                className={css({
                  position: 'absolute',
                  bottom: '300',
                  left: '300',
                  color: 'white',
                  textStyle: 'bodyMd',
                  fontWeight: 'semibold',
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                })}
              >
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Agent attribution strip */}
      <div
        className={css({
          bg: 'bg.alternate',
          px: { base: '400', md: '600' },
          py: '300',
          maxW: '1728px',
          mx: 'auto',
        })}
      >
        <div className={hstack({ gap: '300', alignItems: 'center', flexWrap: 'wrap' })}>
          <Avatar size="sm" initials={listing.agent.split(' ')} />
          <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>
            Listed by{' '}
            <Link href="#" underline="default" size="inline">
              {listing.agent}
            </Link>
          </span>
          <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>|</span>
          <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>
            Brokered by Coldwell Banker Brokers of the Valley
          </span>
        </div>
      </div>

      {/* Body: main column + lead form sidebar */}
      <div
        className={css({
          maxW: '1328px',
          mx: 'auto',
          px: { base: '400', md: '600' },
          pt: '700',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1fr) 316px' },
          gap: { base: '700', lg: '800' },
          alignItems: 'start',
        })}
      >
        <div className={vstack({ alignItems: 'stretch', gap: '800' })}>
          {/* Price + stats + address */}
          <div className={vstack({ alignItems: 'flex-start', gap: '300' })}>
            <div className={hstack({ gap: '200', alignItems: 'center' })}>
              <span
                className={css({
                  w: '8px',
                  h: '8px',
                  borderRadius: 'full',
                  bg: 'green.500',
                  flexShrink: 0,
                })}
              />
              <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>
                House for sale
              </span>
            </div>
            <p className={css({ textStyle: 'displaySm', fontWeight: 'bold', color: 'text.base' })}>
              {listing.price}
            </p>
            <div className={hstack({ gap: '300', alignItems: 'center', flexWrap: 'wrap' })}>
              {[
                ['4', 'bed'],
                ['3.5', 'bath'],
                ['3,082', 'sqft'],
                ['1.5', 'acre lot'],
              ].map(([value, unit], i) => (
                <div key={unit} className={hstack({ gap: '300', alignItems: 'center' })}>
                  {i > 0 && (
                    <span className={css({ textStyle: 'bodyMd', color: 'text.alternate' })}>•</span>
                  )}
                  <span className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
                    <strong>{value}</strong> {unit}
                  </span>
                </div>
              ))}
            </div>
            <p className={css({ textStyle: 'bodyLg', color: 'text.base' })}>
              {listing.address1}, {listing.address2}
            </p>
            <div className={hstack({ gap: '200', alignItems: 'center' })}>
              <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
                Est. $4,637/mo
              </span>
              <Button
                styleType="Ghost"
                size="inline"
                iconOnly={<IconEdit size={2} />}
                aria-label="Edit monthly payment estimate"
              />
            </div>
            <div className={vstack({ alignItems: 'flex-start', gap: '200', pt: '200' })}>
              <Link href="#" underline="default" size="md">
                Veterans: How much home can you afford?
              </Link>
              <Link href="#" underline="default" size="md">
                What can you buy? (It's easy to find out)
              </Link>
            </div>
          </div>

          {/* About this home */}
          <div className={vstack({ alignItems: 'stretch', gap: '500' })}>
            <h2 className={css({ textStyle: 'headingSm', color: 'text.base' })}>About this home</h2>
            <div
              className={css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 300px' },
                gap: '600',
              })}
            >
              <div className={vstack({ alignItems: 'stretch', gap: '500' })}>
                {CONSUMER_HOME_FACTS.slice(0, 3).map((fact) => (
                  <ConsumerFact key={fact.caption} {...fact} />
                ))}
              </div>
              <div className={vstack({ alignItems: 'stretch', gap: '500' })}>
                {CONSUMER_HOME_FACTS.slice(3).map((fact) => (
                  <ConsumerFact key={fact.caption} {...fact} />
                ))}
              </div>
              <div
                className={css({
                  borderWidth: '100',
                  borderStyle: 'solid',
                  borderColor: 'border.base',
                  borderRadius: '300',
                  overflow: 'hidden',
                })}
              >
                <div
                  className={css({
                    h: '128px',
                    bg: 'bg.alternate',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                    Map of {listing.address2}
                  </span>
                </div>
                <div
                  className={hstack({
                    gap: '200',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: '300',
                  })}
                >
                  <IconCar size={2} />
                  <Link href="#" underline="default" size="md">
                    Add a commute
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={vstack({ alignItems: 'flex-start', gap: '500' })}>
            <p className={css({ textStyle: 'bodyMd', color: 'text.base' })}>
              {descExpanded ? CONSUMER_DESCRIPTION : `${CONSUMER_DESCRIPTION.slice(0, 260)}… `}
              <Button
                styleType="Ghost"
                size="inline"
                onClick={() => setDescExpanded((v) => !v)}
              >
                {descExpanded ? 'Show less' : 'Show more'}
              </Button>
            </p>
            <div className={hstack({ gap: '300', flexWrap: 'wrap' })}>
              {CONSUMER_PROMPT_CHIPS.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
          </div>

          {/* Source / stats meta */}
          <div className={vstack({ alignItems: 'flex-start', gap: '300' })}>
            <p className={css({ textStyle: 'caption', color: 'text.alternate' })}>
              Realtor.com checked: A few minutes ago | Listing last updated:{' '}
              {formatListedDate(listing.listDate)} at 1:05 PM (CT)
              <br />
              Source: MRED, MLS #322056378
            </p>
            <div className={hstack({ gap: '300', alignItems: 'center' })}>
              <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>
                <strong>17,038</strong>{' '}
                <Link href="#" underline="dotted" size="inline">
                  views
                </Link>
              </span>
              <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>|</span>
              <span className={css({ textStyle: 'bodySm', color: 'text.base' })}>
                <strong>68</strong>{' '}
                <Link href="#" underline="dotted" size="inline">
                  saves
                </Link>
              </span>
            </div>
          </div>

          {/* Listing agent module */}
          <div
            className={css({
              borderWidth: '100',
              borderStyle: 'solid',
              borderColor: 'border.base',
              borderRadius: '300',
              p: '500',
              display: 'flex',
              flexDirection: { base: 'column', md: 'row' },
              gap: '500',
              alignItems: { base: 'stretch', md: 'center' },
              justifyContent: 'space-between',
            })}
          >
            <div className={hstack({ gap: '400', alignItems: 'center' })}>
              <Avatar size="lg" initials={listing.agent.split(' ')} />
              <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
                <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                  Listed by
                </span>
                <span
                  className={css({
                    textStyle: 'bodyLg',
                    fontWeight: 'semibold',
                    color: 'text.base',
                  })}
                >
                  {listing.agent}
                </span>
                <span className={css({ textStyle: 'bodySm', color: 'text.alternate' })}>
                  RE/MAX Realty group
                </span>
              </div>
            </div>
            <div className={hstack({ gap: '300', flexWrap: 'wrap' })}>
              <Button styleType="Tertiary" size="lg">
                View profile
              </Button>
              <Button styleType="Primary" size="lg">
                Email {listing.agent.split(' ')[0]}
              </Button>
            </div>
          </div>

          {/* See yourself in this home */}
          <div className={vstack({ alignItems: 'stretch', gap: '500' })}>
            <h2 className={css({ textStyle: 'headingSm', color: 'text.base' })}>
              See yourself in this home
            </h2>
            {activeStyle ? (
              <>
                <BeforeAfterSlider
                  key={activeStyle.label}
                  beforeSrc={CONSUMER_RENOVATE_BEFORE}
                  afterSrc={activeStyle.src}
                  afterAlt={`This room restyled in a ${activeStyle.label.toLowerCase()} look`}
                />
                <p className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                  {CONSUMER_RENOVATE_DISCLAIMER}
                </p>
              </>
            ) : (
              <div
                className={css({
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '300',
                  aspectRatio: CONSUMER_RENOVATE_ASPECT,
                  bg: 'bg.alternate',
                })}
              >
                <img
                  src={CONSUMER_RENOVATE_BEFORE}
                  alt="The living room as it looks today"
                  className={mediaFillImage}
                />
                {generating && (
                  <div
                    className={css({
                      position: 'absolute',
                      inset: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bg: 'rgba(0, 0, 0, 0.45)',
                    })}
                  >
                    <span
                      role="status"
                      className={css({
                        textStyle: 'displayLg',
                        fontWeight: 'bold',
                        color: 'white',
                      })}
                    >
                      Generating...
                    </span>
                  </div>
                )}
              </div>
            )}

            <div
              className={css({
                display: 'flex',
                gap: '300',
                overflowX: 'auto',
                pb: '200',
              })}
            >
              {CONSUMER_STYLE_TILES.map((tile, i) => (
                <button
                  key={tile.label}
                  type="button"
                  aria-pressed={i === selectedStyleIndex}
                  onClick={() => setSelectedStyleIndex(i)}
                  className={css({
                    flexShrink: 0,
                    w: '148px',
                    p: '0',
                    cursor: 'pointer',
                    bg: i === selectedStyleIndex ? 'bg.alternate' : 'bg.base',
                    textAlign: 'left',
                    borderRadius: '200',
                    overflow: 'hidden',
                    borderWidth: '200',
                    borderStyle: 'solid',
                    borderColor: i === selectedStyleIndex ? 'border.highlight' : 'border.base',
                  })}
                >
                  <img
                    src={tile.src}
                    alt=""
                    className={css({
                      w: '100%',
                      h: '100px',
                      objectFit: 'cover',
                      display: 'block',
                    })}
                  />
                  <span
                    className={css({
                      display: 'block',
                      px: '300',
                      py: '200',
                      textStyle: 'bodySm',
                      color: 'text.base',
                    })}
                  >
                    {tile.label}
                  </span>
                </button>
              ))}
            </div>

            <div className={hstack({ gap: '300' })}>
              <Button
                styleType="Primary"
                size="lg"
                startIcon={<IconMagicWand size={3} />}
                loading={generating !== null}
                // Nothing to render until a style is staged, so the button spells
                // out that picking a tile is the first step.
                disabled={selectedStyleIndex === null}
                onClick={() => {
                  if (selectedStyleIndex !== null) generateStyle(selectedStyleIndex)
                }}
              >
                Renovate
              </Button>
            </div>

            {!activeStyle && (
              <p className={css({ textStyle: 'caption', color: 'text.alternate' })}>
                Computer generated by Realtor.com based on listing photos. For illustrative purposes
                only and may not be accurate.
              </p>
            )}
          </div>
        </div>

        {/* Lead form */}
        <div
          className={css({
            borderWidth: '100',
            borderStyle: 'solid',
            borderColor: 'border.base',
            borderRadius: '300',
            p: '500',
            position: isDesktop ? 'sticky' : 'static',
            top: '72px',
          })}
        >
          <div className={vstack({ alignItems: 'stretch', gap: '400' })}>
            <TextInput label="Full name" required placeholder="Full name" />
            <TextInput label="Email" required type="email" placeholder="Email" />
            <TextInput label="Phone" required type="tel" placeholder="Phone" />
            <div className={hstack({ gap: '200', alignItems: 'center' })}>
              <Checkbox>I've served in the U.S. military</Checkbox>
              <IconInfo size={2} />
            </div>
            <Button styleType="Emphasis" size="lg">
              Ask a question
            </Button>
            <Button styleType="Tertiary" size="lg">
              Schedule a tour
            </Button>
            <p className={css({ textStyle: 'caption', color: 'text.alternate' })}>
              By proceeding, you consent to receive calls and texts at the number you provided,
              including marketing by autodialer and prerecorded and artificial voice, and email, from
              realtor.com and others about your inquiry and other home-related matters, but not as a
              condition of any purchase.{' '}
              <Link href="#" underline="default" size="inline">
                More
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConsumerFact({
  icon,
  value,
  caption,
}: {
  icon: React.ReactNode
  value: string
  caption: string
}) {
  return (
    <div className={hstack({ gap: '400', alignItems: 'flex-start' })}>
      <span className={css({ color: 'text.base', flexShrink: 0 })}>{icon}</span>
      <div className={vstack({ alignItems: 'flex-start', gap: '0' })}>
        <span className={css({ textStyle: 'bodyMd', color: 'text.base' })}>{value}</span>
        <span className={css({ textStyle: 'caption', color: 'text.alternate' })}>{caption}</span>
      </div>
    </div>
  )
}

// ─── Shell ──────────────────────────────────────────────────────────────────────

type View =
  | { page: 'list' }
  | { page: 'detail'; listingId: string }
  | { page: 'photo-upload'; listingId: string }
  | { page: 'promote-listings' }
  | { page: 'consumer-ldp'; listingId: string }

// "View on Realtor.com" opens a real second tab, which is a fresh app instance —
// so the promoted/enhanced listing data has to travel through storage rather than
// React state. The query string says which listing to open on.
const DEEP_LINK_STORAGE_KEY = 'ir-prototype-listings'
const DEEP_LINK_VIEW = 'consumer-ldp'

/** Reads the deep link written by `openConsumerTab`, if this tab was opened by one. */
function readConsumerDeepLink(): { listingId: string; listings: Listing[] } | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  if (params.get('view') !== DEEP_LINK_VIEW) return null
  const listingId = params.get('listing')
  if (!listingId) return null

  let listings = LISTINGS
  try {
    const snapshot = window.localStorage.getItem(DEEP_LINK_STORAGE_KEY)
    if (snapshot) listings = JSON.parse(snapshot) as Listing[]
  } catch {
    // No usable snapshot just means the buyer sees the pristine listing data.
  }
  return listings.some((l) => l.id === listingId) ? { listingId, listings } : null
}

/** The URL a second tab boots from to land straight on the buyer's view. */
function consumerTabUrl(listingId: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('view', DEEP_LINK_VIEW)
  url.searchParams.set('listing', listingId)
  return url.toString()
}

/** Leaves the current listing data where the tab about to open will find it. */
function persistListingsForConsumerTab(listings: Listing[]) {
  try {
    window.localStorage.setItem(DEEP_LINK_STORAGE_KEY, JSON.stringify(listings))
  } catch {
    // Storage can be blocked; the new tab falls back to the pristine data.
  }
  // The buyer already unlocked this tab, so the one they're about to open shouldn't ask again.
  markTrustedHandoff()
}

export default function Shell() {
  const [deepLink] = useState(readConsumerDeepLink)
  const [listings, setListings] = useState<Listing[]>(deepLink?.listings ?? LISTINGS)
  const [view, setView] = useState<View>(
    deepLink ? { page: 'consumer-ldp', listingId: deepLink.listingId } : { page: 'list' }
  )
  const [promoteTargets, setPromoteTargets] = useState<Listing[] | null>(null)
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const [showSaveConsent, setShowSaveConsent] = useState(false)
  const [pendingPhotos, setPendingPhotos] = useState<string[]>([])
  const [publishingPhotos, setPublishingPhotos] = useState<string[] | null>(null)
  const [experience, setExperience] = useState<Experience>('team')
  const [sidebarPage, setSidebarPage] = useState<SidebarPage>('all-listings')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [overviewStep, setOverviewStep] = useState<'overview' | 'expectations' | 'toc'>('overview')

  const handleSidebarNavigate = (page: SidebarPage) => {
    setSidebarPage(page)
    if (page === 'all-listings') setView({ page: 'list' })
  }

  const selectedListing =
    view.page === 'detail' || view.page === 'photo-upload' || view.page === 'consumer-ldp'
      ? listings.find((l) => l.id === view.listingId)
      : undefined

  const handleConfirmPromote = () => {
    if (promoteTargets && promoteTargets.length > 0) {
      const promotedIds = promoteTargets.map((l) => l.id)
      setListings((prev) =>
        prev.map((l) =>
          promotedIds.includes(l.id) ? { ...l, promoted: true, promotionStatus: 'Promoted' } : l
        )
      )
      if (promotedIds.length === 1) {
        setView({ page: 'detail', listingId: promotedIds[0] })
        setToast({ title: 'Your listing has been promoted and will begin later today.' })
      } else {
        setView({ page: 'list' })
      }
    }
    setPromoteTargets(null)
  }

  // Commits the pending photos once the publishing progress modal finishes.
  // A save on a listing that already had enhanced media burns one regeneration.
  const handlePublishComplete = () => {
    setPublishingPhotos(null)
    if (!selectedListing) return
    const targetId = selectedListing.id
    const isRegeneration = selectedListing.mediaEnhanced === true
    setListings((prev) =>
      prev.map((l) =>
        l.id === targetId
          ? {
              ...l,
              uploadedPhotos: pendingPhotos,
              mediaEnhanced: true,
              regenerationsUsed: (l.regenerationsUsed ?? 0) + 1,
            }
          : l
      )
    )
    setPendingPhotos([])
    setView({ page: 'detail', listingId: targetId })
    setToast({
      title: 'Your photos have been saved',
      body: 'Enhanced media will appear on your listing soon.',
    })
  }

  const showSidebar = view.page !== 'photo-upload'

  const handleSelectExperience = (next: Experience) => {
    setExperience(next)
    if (next === 'team') setView({ page: 'list' })
    setOverviewStep('overview')
  }

  if (experience !== 'team') {
    return (
      <div className={css({ minW: '320px', minH: '100dvh', bg: 'bg.base' })}>
        {experience === 'agent' ? (
          <EnhancedMediaEmailPreview />
        ) : experience === 'overview' ? (
          <>
            <TopBar />
            <main className={css({ pt: HEADER_HEIGHT })}>
              <div
                className={css({
                  maxW: '1140px',
                  mx: 'auto',
                  px: { base: '400', sm: '600', md: '700' },
                  py: { base: '500', md: '700' },
                })}
              >
                {overviewStep === 'overview' ? (
                  <OverviewScreen onNext={() => setOverviewStep('expectations')} />
                ) : overviewStep === 'expectations' ? (
                  <ExpectationsScreen
                    onBack={() => setOverviewStep('overview')}
                    onNext={() => setOverviewStep('toc')}
                  />
                ) : (
                  <TocScreen
                    onBack={() => setOverviewStep('expectations')}
                    onStart={() => handleSelectExperience('team')}
                  />
                )}
              </div>
            </main>
          </>
        ) : (
          <>
            <TopBar />
            <PlaceholderExperience
              label={EXPERIENCES.find((exp) => exp.id === experience)?.label ?? ''}
            />
          </>
        )}
      </div>
    )
  }

  // The consumer listing page is what a buyer sees on realtor.com, so it renders
  // without any of the PRO chrome — no TopBar, no side nav.
  if (view.page === 'consumer-ldp' && selectedListing) {
    return (
      <div className={css({ minW: '320px' })}>
        <ConsumerLdpScreen
          listing={selectedListing}
          onBack={() => setView({ page: 'detail', listingId: selectedListing.id })}
        />
      </div>
    )
  }

  return (
    <div className={css({ minW: '320px', minH: '100dvh', bg: 'bg.base' })}>
      <TopBar onMenuClick={showSidebar ? () => setMobileNavOpen(true) : undefined} />
      {showSidebar && (
        <>
          <Sidebar
            activePage={view.page === 'list' ? 'all-listings' : sidebarPage}
            onNavigate={handleSidebarNavigate}
          />
          <MobileSidebarDrawer
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            activePage={view.page === 'list' ? 'all-listings' : sidebarPage}
            onNavigate={handleSidebarNavigate}
          />
        </>
      )}
      <main
        className={css({
          pt: HEADER_HEIGHT,
          ml: '0',
          md: { ml: showSidebar ? SIDEBAR_WIDTH : '0' },
        })}
      >
        {view.page === 'photo-upload' && selectedListing ? (
          <PhotoUploadScreen
            listing={selectedListing}
            onBack={() => setView({ page: 'detail', listingId: selectedListing.id })}
            onSave={(photos) => {
              setPendingPhotos(photos)
              const hasNewPhotos = photos.some((p) => !selectedListing.uploadedPhotos.includes(p))
              if (hasNewPhotos) {
                // New photos need fresh Authorization and Release consent first.
                setShowSaveConsent(true)
              } else {
                setPublishingPhotos(photos)
              }
            }}
          />
        ) : (
          <div
            className={css({
              maxW: '1140px',
              mx: 'auto',
              px: { base: '400', sm: '600', md: '700' },
              py: { base: '500', md: '700' },
            })}
          >
            {view.page === 'list' && (
              <AllListingsScreen
                listings={listings}
                onSelectListing={(id) => setView({ page: 'detail', listingId: id })}
                onPromote={(listing) => setPromoteTargets([listing])}
                onOpenPromoteListings={() => setView({ page: 'promote-listings' })}
                onEnhance={(listing) => setView({ page: 'photo-upload', listingId: listing.id })}
              />
            )}
            {view.page === 'promote-listings' && (
              <PromoteListingsScreen
                listings={listings}
                onBack={() => setView({ page: 'list' })}
                onSelectListing={(id) => setView({ page: 'detail', listingId: id })}
                onRequestPromote={(selectedListings) => setPromoteTargets(selectedListings)}
              />
            )}
            {view.page === 'detail' && selectedListing && (
              <ListingDetailScreen
                listing={selectedListing}
                onBack={() => setView({ page: 'list' })}
                onPromote={(listing) => setPromoteTargets([listing])}
                onEnhance={(listing) => setView({ page: 'photo-upload', listingId: listing.id })}
                viewOnRealtorHref={consumerTabUrl(selectedListing.id)}
                onViewOnRealtor={() => persistListingsForConsumerTab(listings)}
              />
            )}
          </div>
        )}
      </main>

      <PromoteModal
        listings={promoteTargets}
        onClose={() => setPromoteTargets(null)}
        onConfirm={handleConfirmPromote}
      />

      <SaveImagesModal
        open={showSaveConsent}
        onClose={() => setShowSaveConsent(false)}
        onDeny={() => setShowSaveConsent(false)}
        onConfirm={() => {
          setShowSaveConsent(false)
          setPublishingPhotos(pendingPhotos)
        }}
      />

      <PublishingPhotosModal
        photos={publishingPhotos}
        onCancel={() => setPublishingPhotos(null)}
        onComplete={handlePublishComplete}
      />

      <Toast show={!!toast} onClose={() => setToast(null)} status="success" title={toast?.title}>
        {toast?.body}
      </Toast>

    </div>
  )
}
