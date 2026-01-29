import AddPartnerForm from "@/components/admin/AddPartnerForm";
import PartnerList from "@/components/admin/PartnerList";

export default function AdminPartnersPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
          Gestion <span className="text-orange-500">Partenaires</span>
        </h1>
        <p className="text-slate-500 italic">Ajoutez ou retirez les logos des entreprises qui vous font confiance.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Colonne Formulaire (1/3 de l'espace) */}
        <div className="xl:col-span-1 sticky top-10">
          <AddPartnerForm />
        </div>

        {/* Colonne Liste (2/3 de l'espace) */}
        <div className="xl:col-span-2">
          <PartnerList />
        </div>
      </div>
    </div>
  );
}