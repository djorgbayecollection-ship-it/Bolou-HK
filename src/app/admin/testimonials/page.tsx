import AddTestimonialForm from "@/components/admin/AddTestimonialForm";
import TestimonialList from "@/components/admin/TestimonialList";

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
          Avis <span className="text-emerald-500">Clients</span>
        </h1>
        <p className="text-slate-500 italic">Gérez les témoignages qui seront affichés sur votre page d'accueil.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Colonne Formulaire */}
        <div className="xl:col-span-1 sticky top-10">
          <AddTestimonialForm />
        </div>

        {/* Colonne Liste */}
        <div className="xl:col-span-2">
          <TestimonialList />
        </div>
      </div>
    </div>
  );
}