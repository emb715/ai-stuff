#!/bin/bash
# usage: judge.sh qid task A B order
S=${SCRATCH:?set SCRATCH to the folder holding picks/img}
F=/home/user/ai-stuff/experiments/design-skill/evals/fixtures
d=$S/m3/runs/$1-$5; mkdir -p $d; cd $d; git init -q 2>/dev/null
cp $S/picks/img/$3.jpg A.jpg; cp $S/picks/img/$4.jpg B.jpg
if [ $2 = t1 ]; then B1=$(head -1 $F/t1-build-landing.txt | sed 's/ Do not ask.*//'); else B1=$(head -1 $F/t3-build-dashboard.txt | sed 's/ Do not ask.*//'); fi
P="You are judging two versions of the same web page built from the same brief. Brief: $B1
Open A.jpg and B.jpg in the current directory (full-page screenshots) and look at both carefully. Judge as a demanding design lead on visual craft and taste: hierarchy, typography, spacing rhythm, restraint, distinctiveness, and fit to the brief. Ignore copy differences. If both are below the bar you would ship, answer NEITHER.
Reply with exactly two lines:
WINNER: A or B or TIE or NEITHER
WHY: one sentence."
timeout 300 claude -p "$P" --model claude-sonnet-5-5 --permission-mode acceptEdits --allowedTools Read > out.txt 2>err.txt
echo "$1 $5 $(grep -o 'WINNER: [A-Z]*' out.txt)"
