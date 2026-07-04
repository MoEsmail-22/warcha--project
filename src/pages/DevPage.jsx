import { useState } from 'react';
import { Calendar, Car, DollarSign, Star, Bell, Search } from 'lucide-react';

// UI primitives
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Toggle,
  Modal,
  Drawer,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

// Widgets
import { StatCard, ProPlanCard, RatingStars } from '@/components/widgets';

function DevPage() {
  // State for the interactive demos
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="bg-surface-page min-h-screen p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Page header */}
        <header>
          <h1 className="text-primary text-3xl font-bold">UI Primitives Showcase</h1>
          <p className="mt-2 text-gray-600">Every component in every variant.</p>
        </header>

        {/* 1. Brand colors */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Brand colors</h2>
          <div className="flex flex-wrap gap-3">
            <div className="bg-primary flex h-20 w-32 items-end rounded-lg p-2 text-xs text-white">
              primary #0D4D47
            </div>
            <div className="bg-primary-light text-primary flex h-20 w-32 items-end rounded-lg p-2 text-xs">
              primary-light #A8D8D8
            </div>
            <div className="bg-accent flex h-20 w-32 items-end rounded-lg p-2 text-xs text-white">
              accent #FFA500
            </div>
            <div className="bg-accent-dark flex h-20 w-32 items-end rounded-lg p-2 text-xs text-white">
              accent-dark #E59400
            </div>
          </div>
        </Card>

        {/* 2. Buttons */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Buttons</h2>
          <div className="mb-4">
            <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">Variants</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Card>

        {/* 3. Badges */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge status="pending" />
            <Badge status="confirmed" />
            <Badge status="in_service" />
            <Badge status="in_progress" />
            <Badge status="new" />
            <Badge status="cancelled" />
            <Badge status="completed" />
            <Badge status="delayed" />
            <Badge status="urgent" />
            <Badge status="draft" />
            <Badge status="sent" />
            <Badge status="accepted" />
            <Badge status="rejected" />
            <Badge status="expired" />
          </div>
        </Card>

        {/* 4. Inputs */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Inputs</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="demo-name"
              label="Customer name"
              placeholder="Ahmed Ali"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              id="demo-error"
              label="Phone (with error)"
              placeholder="01xxxxxxxxx"
              error="Phone number is required"
            />
            <Input placeholder="No label, just placeholder" />
            <Input placeholder="Disabled input" disabled />
          </div>
        </Card>

        {/* 5. Select */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Select</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select id="demo-status" label="Status" defaultValue="pending">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select id="demo-service" label="Service" defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              <option value="oil">Oil change</option>
              <option value="brakes">Brake repair</option>
              <option value="tire">Tire rotation</option>
            </Select>
          </div>
        </Card>

        {/* 6. Toggle */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Toggle</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <Toggle
                id="demo-toggle-on"
                label="Accept online bookings"
                description="When ON, customers can book through the website."
                checked={toggleOn}
                onChange={setToggleOn}
              />
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <Toggle
                id="demo-toggle-off"
                label="Show prices to customers"
                description="When OFF, prices are hidden from customer-facing pages."
                checked={toggleOff}
                onChange={setToggleOff}
              />
            </div>
          </div>
        </Card>

        {/* 7. Cards */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Cards</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card hover className="text-center">
              <p className="text-primary text-3xl font-bold">8</p>
              <p className="mt-1 text-sm text-gray-600">Hoverable card</p>
            </Card>
            <Card hover className="text-center">
              <p className="text-accent text-3xl font-bold">3</p>
              <p className="mt-1 text-sm text-gray-600">Hover me</p>
            </Card>
            <Card hover={false} padded={false} className="overflow-hidden">
              <div className="bg-primary p-4 text-white">
                <p className="text-sm font-semibold">No padding</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">For headers/footers.</p>
              </div>
            </Card>
          </div>
        </Card>

        {/* 8. StatCard widget */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">StatCard widget (KPI cards)</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
              icon={<Calendar size={20} />}
              value="8"
              label="Today's bookings"
              subtext="+2 vs yesterday"
              trend="up"
            />
            <StatCard
              icon={<Car size={20} />}
              value="3"
              label="Cars in service"
              subtext="2 awaiting approval"
              trend="neutral"
            />
            <StatCard
              icon={<DollarSign size={20} />}
              value="12,450"
              label="Revenue today (EGP)"
              subtext="+18% this week"
              trend="up"
            />
            <StatCard
              icon={<Star size={20} />}
              value="4.8"
              label="Average rating"
              subtext="124 reviews"
              trend="neutral"
            />
          </div>
        </Card>

        {/* 9. RatingStars widget */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">RatingStars widget</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm text-gray-600">5.0</span>
              <RatingStars rating={5} size="md" showNumber />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm text-gray-600">4.8 (partial)</span>
              <RatingStars rating={4.8} size="md" showNumber />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm text-gray-600">3.5 (half)</span>
              <RatingStars rating={3.5} size="md" showNumber />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm text-gray-600">2.0</span>
              <RatingStars rating={2} size="md" showNumber />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm text-gray-600">Large size</span>
              <RatingStars rating={4.8} size="lg" showNumber />
            </div>
          </div>
        </Card>

        {/* 10. ProPlanCard widget */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">ProPlanCard widget</h2>
          <p className="mb-4 text-sm text-gray-600">
            Wrapped in a dark teal container to preview how it looks inside the sidebar.
          </p>
          <div className="bg-primary max-w-xs rounded-xl p-4">
            <ProPlanCard />
          </div>
        </Card>

        {/* 11. Table */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Table</h2>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Customer</TH>
                  <TH>Service</TH>
                  <TH>Time</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                <TR>
                  <TD>
                    <div className="font-medium text-gray-900">Hazem M.</div>
                    <div className="text-xs text-gray-500">Toyota Corolla</div>
                  </TD>
                  <TD>Oil change</TD>
                  <TD>10:30 AM</TD>
                  <TD>
                    <Badge status="in_service" />
                  </TD>
                </TR>
                <TR>
                  <TD>
                    <div className="font-medium text-gray-900">Sara K.</div>
                    <div className="text-xs text-gray-500">Honda Civic</div>
                  </TD>
                  <TD>Brake inspection</TD>
                  <TD>11:45 AM</TD>
                  <TD>
                    <Badge status="new" />
                  </TD>
                </TR>
                <TR>
                  <TD>
                    <div className="font-medium text-gray-900">Omar T.</div>
                    <div className="text-xs text-gray-500">Hyundai Elantra</div>
                  </TD>
                  <TD>Tire rotation</TD>
                  <TD>01:00 PM</TD>
                  <TD>
                    <Badge status="confirmed" />
                  </TD>
                </TR>
                <TR>
                  <TD>
                    <div className="font-medium text-gray-900">Nadia F.</div>
                    <div className="text-xs text-gray-500">Kia Sportage</div>
                  </TD>
                  <TD>Engine diagnostic</TD>
                  <TD>03:15 PM</TD>
                  <TD>
                    <Badge status="completed" />
                  </TD>
                </TR>
              </TBody>
            </Table>
          </div>
        </Card>

        {/* 12. Modal + Drawer */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Overlay components</h2>
          <p className="mb-4 text-sm text-gray-600">
            Click each button. Press Esc or click the backdrop to close.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal demo */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create new booking"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Save booking
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input id="modal-customer" label="Customer name" placeholder="Ahmed Ali" />
          <Input id="modal-vehicle" label="Vehicle (plate)" placeholder="ABC-1234" />
          <Select id="modal-service" label="Service" defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            <option value="oil">Oil change</option>
            <option value="brakes">Brake repair</option>
            <option value="tire">Tire rotation</option>
          </Select>
        </div>
      </Modal>

      {/* Drawer demo */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Booking details"
        footer={
          <>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setDrawerOpen(false)}>
              Edit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs tracking-wide text-gray-500 uppercase">Customer</p>
            <p className="font-medium">Ahmed Ali</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-gray-500 uppercase">Vehicle</p>
            <p className="font-medium">Toyota Corolla — ABC-1234</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-gray-500 uppercase">Service</p>
            <p className="font-medium">Oil change + filter</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-gray-500 uppercase">Status</p>
            <div className="mt-1">
              <Badge status="confirmed" />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default DevPage;
