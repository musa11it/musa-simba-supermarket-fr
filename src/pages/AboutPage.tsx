import { useTranslation } from 'react-i18next';
import { ShoppingBag, Users, MapPin, Award, Heart, Truck } from 'lucide-react';

const stats = [
  { label: 'Branches Across Rwanda', value: '11+', icon: <MapPin size={28} /> },
  { label: 'Happy Customers', value: '50,000+', icon: <Users size={28} /> },
  { label: 'Products Available', value: '500+', icon: <ShoppingBag size={28} /> },
  { label: 'Years of Service', value: '15+', icon: <Award size={28} /> },
];

const values = [
  {
    icon: <Heart className="text-simba-500" size={32} />,
    title: 'Customer First',
    desc: 'Every decision we make starts with our customers. We listen, adapt, and constantly improve to serve you better.',
  },
  {
    icon: <Award className="text-simba-500" size={32} />,
    title: 'Quality Assurance',
    desc: 'We source only the finest products, working directly with local farmers and trusted suppliers to ensure freshness.',
  },
  {
    icon: <Truck className="text-simba-500" size={32} />,
    title: 'Convenient Pick-Up',
    desc: 'Order online and pick up at your nearest branch in Kigali and beyond — no waiting, no hassle.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-simba-600 to-simba-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">About Simba Supermarket</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Rwanda's #1 supermarket chain, serving communities across the country since 2009.
            Fresh, affordable, and always at your service.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex justify-center mb-3 text-simba-500">{s.icon}</div>
              <div className="text-3xl font-bold font-display text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              Simba Supermarket was founded with a simple mission: to make quality groceries accessible to every Rwandan family. What started as a single store in Kigali has grown into Rwanda's most trusted supermarket chain, with 11 branches spanning from Kigali to Gisenyi and Nyanza.
            </p>
            <p>
              We believe that shopping for food should be a pleasure, not a chore. That's why we've built our stores with families in mind — clean, well-organized spaces stocked with fresh produce, quality meats, dairy, bakery items, and everything you need for your household.
            </p>
            <p>
              With Simba Supermarket 2.0, we've taken our commitment to convenience even further with online shopping and hassle-free pick-up from your nearest branch. Shop in your language — English, Kinyarwanda, or French — and pay with MTN Mobile Money.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-gray-900 mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6">
                <div className="flex justify-center mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold font-display text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
