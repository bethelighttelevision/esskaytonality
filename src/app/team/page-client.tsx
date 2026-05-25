"use client";

interface Member {
  name: string;
  title: string;
  image: string;
}

interface CategoryGroup {
  category: string;
  members: Member[];
}

interface TeamClientProps {
  categories: CategoryGroup[];
}

export default function TeamClient({ categories }: TeamClientProps) {
  return (
    <section className="min-h-screen bg-brand-bg pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Our <span className="text-gradient">Team</span>
          </h1>
          <p className="text-brand-muted-dark text-lg max-w-2xl mx-auto">
            The people behind ESSKAYTONALITY.
          </p>
        </div>

        <div className="space-y-20">
          {categories.map((group) => (
            <div key={group.category}>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-4">
                {group.category}
              </h2>
              <div className="h-[3px] bg-gradient-to-r from-brand-primary via-brand-primary/50 to-transparent mb-10" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10 max-w-[740px] mx-auto md:mx-0">
                {group.members.map((member) => (
                  <div key={member.name} className="text-center">
                    <div className="aspect-[2/3] bg-brand-card rounded-lg overflow-hidden mb-3">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <h3 className="text-brand-primary font-bold text-base leading-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="text-brand-muted-dark text-xs leading-relaxed">
                      {member.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
