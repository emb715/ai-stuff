import json,glob,os,re,sys
S=os.path.dirname(os.path.abspath(__file__))
names=['brainstorming','product-brief','decision-making','quick-spec','issue-to-ready-specs','raa','implementation-orchestration','issue-to-pr','build-to-release','agent-installer','acceptance-verification','adversarial-code-review','readiness-cycle','retrospective','incident-response','loop-prd-readiness','loop-implementation-readiness','review-release-candidate','repo-primitive-audit','knowledge-extraction','issues-to-roadmap','test-authoring','skill-authoring','request-triage']
def parse(f):
    loaded=False; skills=[]; text=''; model=None; cost=0; hookctx=''
    for l in open(f):
        try:e=json.loads(l)
        except: continue
        if e.get('type')=='system' and e.get('subtype')=='init': model=e.get('model')
        if e.get('type')=='assistant':
            for c in e['message'].get('content',[]):
                if c.get('type')=='tool_use':
                    inp=json.dumps(c.get('input',{}))
                    if c['name']=='Skill':
                        skills.append(c['input'].get('skill') or c['input'].get('command'))
                        if 'artifact-router' in inp: loaded=True
                    if c['name'] in('Read','Bash') and 'ai-stuff-artifact-router/SKILL.md' in inp: loaded=True
        if e.get('type')=='result': text=e.get('result') or ''; cost=e.get('total_cost_usd',0)
        if 'artifact_relevance' in l and e.get('type')!='assistant': hookctx='yes'
    named=[n for n in names if re.search(r'(?<![\w-])'+re.escape(n)+r'(?![\w-])',text)]
    su=re.findall(r'SKILLS_USED:\s*(.*)',text)
    return dict(loaded=loaded,skills=skills,named=named,skills_used=su[-1] if su else '',model=model,cost=cost,hint=hookctx,text=text)
cond=sys.argv[1]
rows=[]
for f in sorted(glob.glob(f'{S}/out/{cond}/*.jsonl')):
    r=parse(f); r['run']=os.path.basename(f)[:-6]; rows.append(r)
    print(f"{r['run']:7} load={'Y' if r['loaded'] else '-'} hint={r['hint'] or '-'} skills={r['skills']} named={r['named'][:5]} SU={r['skills_used'][:40]}")
print('cost',round(sum(r['cost'] for r in rows),2),'models',set(r['model'] for r in rows))
json.dump(rows,open(f'{S}/graded-{cond}.json','w'),indent=1)
